import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { SemesterEndpoints } from '../../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../../shared/endpoints/student-mark-sheet-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { MarkSheetListItem } from '../../../shared/endpoints/models/student-mark-sheet/mark-sheet-list-item';
import { MarkSheetStatus } from '../../../../../core/enums/mark-sheet-status';
import { ViewSheetDialog } from './dialog/view-sheet-dialog/view-sheet-dialog';

@Component({
  selector: 'app-confirm-reopen',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './confirm-reopen.html',
})
export class ConfirmReopenPage implements OnInit, OnChanges {
  language = inject(Language);
  dialog = inject(MatDialog);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  semesterEndpoints = inject(SemesterEndpoints);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  /** Shared with the results center — changing it here updates every other tab too. */
  @Input() ageGroupId: number | null = null;
  @Input() ageGroupItems: AgeGroupModel[] = [];
  @Output() ageGroupIdChange = new EventEmitter<number | null>();

  /** Confirming/reopening a sheet moves the year-scope pipeline stage — tell the results center to refresh its shared bar. */
  @Output() pipelineRefresh = new EventEmitter<void>();

  loading = signal(false);
  records = signal<MarkSheetListItem[]>([]);
  semesters = signal<GetSemesterByAcademicYearModel[]>([]);
  totalPages = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);

  filterForm!: FormGroup;
  headerTable = ['subjectName', 'ageGroupName', 'section', 'semesterName', 'status', 'enteredStudentCount', 'action'];

  MarkSheetStatus = MarkSheetStatus;
  statusOptions = [MarkSheetStatus.Submitted, MarkSheetStatus.Confirmed];

  statusLabelKey(status: number) {
    switch (status) {
      case MarkSheetStatus.Draft: return 'mark_sheet_status_draft_title' as const;
      case MarkSheetStatus.Submitted: return 'mark_sheet_status_submitted_title' as const;
      case MarkSheetStatus.Confirmed: return 'mark_sheet_status_confirmed_title' as const;
      case MarkSheetStatus.Published: return 'mark_sheet_status_published_title' as const;
      default: return 'mark_sheet_status_draft_title' as const;
    }
  }

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  ngOnInit(): void {
    const snap = this.route.snapshot.queryParams;
    const urlSemesterId = snap['semesterId'] ? +snap['semesterId'] : null;
    const urlStatus = snap['status'] ? +snap['status'] : MarkSheetStatus.Submitted;
    if (snap['pageNumber']) this.pageNumber.set(+snap['pageNumber']);
    if (snap['pageSize']) this.pageSize.set(+snap['pageSize']);

    this.filterForm = this.fb.group({
      semesterId: [urlSemesterId],
      status: [urlStatus],
    });

    this.semesterEndpoints.getSemesterByAcademicYear({
      year: this.selectedAcademicYearSvc.selected()?.year, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        if (!urlSemesterId) {
          const active = page.content.find(s => s.isActive) ?? page.content[0];
          if (active) {
            this.filterForm.patchValue({ semesterId: active.academicYearSemesterId }, { emitEvent: false });
          }
        }
        this.loadRecords();
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ageGroupId'] && !changes['ageGroupId'].firstChange && this.filterForm) {
      this.onFilterChange();
    }
  }

  onAgeGroupSelect(value: number | null): void {
    this.ageGroupIdChange.emit(value);
  }

  onFilterChange(): void {
    this.pageNumber.set(1);
    this.syncUrl();
    this.loadRecords();
  }

  changePage(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.syncUrl();
    this.loadRecords();
  }

  openView(row: MarkSheetListItem): void {
    const ref = this.dialog.open(ViewSheetDialog, {
      width: '90vw',
      maxWidth: '900px',
      data: { sheetId: row.id },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) {
        this.loadRecords();
        this.pipelineRefresh.emit();
      }
    });
  }

  loadRecords(): void {
    const { semesterId, status } = this.filterForm.value;
    if (!semesterId) return;
    this.loading.set(true);
    this.sheetEndpoints.getFiltered({
      academicYearSemesterId: semesterId,
      ageGroupId: this.ageGroupId ?? null,
      status: status ?? null,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    }).subscribe({
      next: page => {
        this.records.set(page.content);
        this.totalPages.set(page.countPages);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  private syncUrl(): void {
    const { semesterId, status } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        semesterId: semesterId ?? null,
        status: status ?? null,
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }
}
