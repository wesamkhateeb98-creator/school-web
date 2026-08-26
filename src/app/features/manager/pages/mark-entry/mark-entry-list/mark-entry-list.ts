import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { StaffProfileService } from '../../../../staff/services/staff-profile.service';
import { StaffPermission } from '../../../../../core/enums/staff-permission.enum';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { SubjectAgeGroupModel } from '../../../shared/endpoints/models/age-group/subject-age-group-model';
import { ClassEndpoints } from '../../../shared/endpoints/class-endpoint';
import { ClassModel } from '../../../shared/endpoints/models/class/class-model';
import { AcademicYearModel } from '../../academic-year/model/academic-year-model';
import { SemesterEndpoints } from '../../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../../shared/endpoints/student-mark-sheet-endpoint';
import { MarkSheetListItem } from '../../../shared/endpoints/models/student-mark-sheet/mark-sheet-list-item';
import { MarkSheetStatus } from '../../../../../core/enums/mark-sheet-status';
import { DeleteDialog } from '../../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { GenerateSheetsDialog } from './dialog/generate-sheets-dialog/generate-sheets-dialog';

@Component({
  selector: 'app-mark-entry-list',
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
  templateUrl: './mark-entry-list.html',
  styleUrl: './mark-entry-list.scss',
})
export class MarkEntryListPage implements OnInit {
  language = inject(Language);
  dialog = inject(MatDialog);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  classEndpoints = inject(ClassEndpoints);
  semesterEndpoints = inject(SemesterEndpoints);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);
  staffProfile = inject(StaffProfileService);

  canGenerate = computed(() => this.staffProfile.hasPermission(StaffPermission.AddSubjectMarkSheet));
  canDelete = computed(() => this.staffProfile.hasPermission(StaffPermission.DeleteSubjectMarkSheet));

  /** The advisor role can't call /academic-year (admin-only), so the current year is read
   *  off the semester list instead — every GetSemesterByAcademicYearModel already carries it. */
  private currentAcademicYearId = signal<number | null>(null);

  loading = signal(false);
  records = signal<MarkSheetListItem[]>([]);
  ageGroupItems = signal<AgeGroupModel[]>([]);
  classItems = signal<ClassModel[]>([]);
  subjectItems = signal<SubjectAgeGroupModel[]>([]);
  semesters = signal<GetSemesterByAcademicYearModel[]>([]);
  totalPages = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);

  filterForm!: FormGroup;
  headerTable = ['subjectName', 'ageGroupName', 'section', 'status', 'completion', 'action'];

  MarkSheetStatus = MarkSheetStatus;

  statusLabelKey(status: number) {
    switch (status) {
      case MarkSheetStatus.Draft: return 'mark_sheet_status_draft_title' as const;
      case MarkSheetStatus.Submitted: return 'mark_sheet_status_submitted_title' as const;
      case MarkSheetStatus.Confirmed: return 'mark_sheet_status_confirmed_title' as const;
      case MarkSheetStatus.Published: return 'mark_sheet_status_published_title' as const;
      default: return 'mark_sheet_status_draft_title' as const;
    }
  }

  statusClass(status: number): string {
    switch (status) {
      case MarkSheetStatus.Draft: return 'status-chip status-chip--draft';
      case MarkSheetStatus.Submitted: return 'status-chip status-chip--submitted';
      case MarkSheetStatus.Confirmed: return 'status-chip status-chip--confirmed';
      case MarkSheetStatus.Published: return 'status-chip status-chip--published';
      default: return 'status-chip';
    }
  }

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  ngOnInit(): void {
    const snap = this.route.snapshot.queryParams;
    const urlSemesterId = snap['semesterId'] ? +snap['semesterId'] : null;
    const urlAgeGroupId = snap['ageGroupId'] ? +snap['ageGroupId'] : null;
    const urlClassId = snap['classId'] ? +snap['classId'] : null;
    const urlSubjectAgeGroupId = snap['subjectAgeGroupId'] ? +snap['subjectAgeGroupId'] : null;
    const urlStatus = snap['status'] ? +snap['status'] : null;
    if (snap['pageNumber']) this.pageNumber.set(+snap['pageNumber']);
    if (snap['pageSize']) this.pageSize.set(+snap['pageSize']);

    this.filterForm = this.fb.group({
      semesterId: [urlSemesterId],
      ageGroupId: [urlAgeGroupId],
      classId: [urlClassId],
      subjectAgeGroupId: [urlSubjectAgeGroupId],
      status: [urlStatus],
    });

    this.ageGroupEndpoints.get('', 1, 100).subscribe({
      next: page => this.ageGroupItems.set(page.content),
    });

    this.semesterEndpoints.getSemesterByAcademicYear({
      year: undefined, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        this.currentAcademicYearId.set(page.content[0]?.academicYearId ?? null);

        if (!urlSemesterId) {
          const active = page.content.find(s => s.isActive) ?? page.content[0];
          if (active) {
            this.filterForm.patchValue({ semesterId: active.academicYearSemesterId }, { emitEvent: false });
          }
        }

        if (urlAgeGroupId) {
          this.loadClasses(urlAgeGroupId);
          this.loadSubjects(urlAgeGroupId);
        }

        this.loadRecords();
      },
    });
  }

  onAgeGroupChange(): void {
    const ageGroupId = this.filterForm.value.ageGroupId;
    this.filterForm.patchValue({ classId: null, subjectAgeGroupId: null }, { emitEvent: false });
    this.classItems.set([]);
    this.subjectItems.set([]);
    if (ageGroupId) {
      this.loadClasses(ageGroupId);
      this.loadSubjects(ageGroupId);
    }
    this.onFilterChange();
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

  openGrid(row: MarkSheetListItem): void {
    this.router.navigate(['/manager/mark-entry', row.id]);
  }

  openGenerateDialog(): void {
    const { semesterId, ageGroupId, classId } = this.filterForm.value;
    const ref = this.dialog.open(GenerateSheetsDialog, {
      width: '480px',
      data: {
        semesters: this.semesters(),
        ageGroupItems: this.ageGroupItems(),
        selectedSemesterId: semesterId,
        selectedAgeGroupId: ageGroupId,
        selectedClassId: classId,
      },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadRecords();
    });
  }

  openDeleteDialog(row: MarkSheetListItem): void {
    const ref = this.dialog.open(DeleteDialog, {
      width: '40%',
      data: {
        title: this.language.transform('delete_sheet_confirm_message'),
        action: () => {
          this.sheetEndpoints.delete(row.id).subscribe({
            next: () => {
              ref.close();
              this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
              this.loadRecords();
            },
            error: err => {
              this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            },
          });
        },
      },
    });
  }

  private loadClasses(ageGroupId: number): void {
    const academicYearId = this.currentAcademicYearId();
    this.classEndpoints.get({
      ageGroup: { id: ageGroupId } as AgeGroupModel,
      academicYear: academicYearId ? ({ id: academicYearId } as AcademicYearModel) : undefined,
      pageNumber: 1,
      pageSize: 100,
    }).subscribe({
      next: page => this.classItems.set(page.content),
    });
  }

  private loadSubjects(ageGroupId: number): void {
    this.ageGroupEndpoints.getSubjectAgeGroups(ageGroupId, null, 1, 200).subscribe({
      next: page => this.subjectItems.set(page.content),
    });
  }

  loadRecords(): void {
    const { semesterId, ageGroupId, classId, subjectAgeGroupId, status } = this.filterForm.value;
    if (!semesterId) return;
    this.loading.set(true);
    this.sheetEndpoints.getFiltered({
      academicYearSemesterId: semesterId,
      ageGroupId: ageGroupId ?? null,
      classId: classId ?? null,
      subjectAgeGroupId: subjectAgeGroupId ?? null,
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
    const { semesterId, ageGroupId, classId, subjectAgeGroupId, status } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        semesterId: semesterId ?? null,
        ageGroupId: ageGroupId ?? null,
        classId: classId ?? null,
        subjectAgeGroupId: subjectAgeGroupId ?? null,
        status: status ?? null,
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'replace',
    });
  }
}
