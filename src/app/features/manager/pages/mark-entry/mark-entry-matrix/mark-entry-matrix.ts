import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { StaffProfileService } from '../../../../staff/services/staff-profile.service';
import { StaffPermission } from '../../../../../core/enums/staff-permission.enum';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { SemesterEndpoints } from '../../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../../shared/endpoints/student-mark-sheet-endpoint';
import { MarkSheetMatrixCell } from '../../../shared/endpoints/models/student-mark-sheet/mark-sheet-matrix-response';
import { MarkSheetStatus } from '../../../../../core/enums/mark-sheet-status';

interface MatrixColumn {
  classId: number;
  section: number;
}

interface MatrixRow {
  subjectAgeGroupId: number;
  subjectName: string;
  cellsByClass: Map<number, MarkSheetMatrixCell>;
}

@Component({
  selector: 'app-mark-entry-matrix',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './mark-entry-matrix.html',
  styleUrl: './mark-entry-matrix.scss',
})
export class MarkEntryMatrixPage implements OnInit {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  semesterEndpoints = inject(SemesterEndpoints);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);
  staffProfile = inject(StaffProfileService);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  canGenerate = computed(() => this.staffProfile.hasPermission(StaffPermission.AddSubjectMarkSheet));

  loading = signal(false);
  ageGroupItems = signal<AgeGroupModel[]>([]);
  semesters = signal<GetSemesterByAcademicYearModel[]>([]);
  columns = signal<MatrixColumn[]>([]);
  rows = signal<MatrixRow[]>([]);

  MarkSheetStatus = MarkSheetStatus;

  filterForm!: FormGroup;

  statusLabelKey(status: number | null) {
    switch (status) {
      case MarkSheetStatus.Draft: return 'mark_sheet_status_draft_title' as const;
      case MarkSheetStatus.Submitted: return 'mark_sheet_status_submitted_title' as const;
      case MarkSheetStatus.Confirmed: return 'mark_sheet_status_confirmed_title' as const;
      case MarkSheetStatus.Published: return 'mark_sheet_status_published_title' as const;
      default: return 'no_sheet_title' as const;
    }
  }

  statusClass(status: number | null): string {
    switch (status) {
      case MarkSheetStatus.Draft: return 'status-chip status-chip--draft';
      case MarkSheetStatus.Submitted: return 'status-chip status-chip--submitted';
      case MarkSheetStatus.Confirmed: return 'status-chip status-chip--confirmed';
      case MarkSheetStatus.Published: return 'status-chip status-chip--published';
      default: return 'status-chip status-chip--none';
    }
  }

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  ngOnInit(): void {
    const snap = this.route.snapshot.queryParams;
    const urlSemesterId = snap['semesterId'] ? +snap['semesterId'] : null;
    const urlAgeGroupId = snap['ageGroupId'] ? +snap['ageGroupId'] : null;

    this.filterForm = this.fb.group({
      semesterId: [urlSemesterId],
      ageGroupId: [urlAgeGroupId],
    });

    this.ageGroupEndpoints.get('', 1, 100).subscribe({
      next: page => this.ageGroupItems.set(page.content),
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
        if (this.filterForm.value.ageGroupId) this.load();
      },
    });
  }

  onFilterChange(): void {
    this.syncUrl();
    this.load();
  }

  openCell(row: MatrixRow, column: MatrixColumn): void {
    const cell = row.cellsByClass.get(column.classId);
    if (!cell) return;
    if (cell.markSheetId) {
      this.router.navigate(['/manager/mark-entry', cell.markSheetId]);
      return;
    }
    if (!this.canGenerate()) return;
    const { semesterId, ageGroupId } = this.filterForm.value;
    this.sheetEndpoints.generate(semesterId, ageGroupId, column.classId).subscribe({
      next: () => this.load(),
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      },
    });
  }

  private load(): void {
    const { semesterId, ageGroupId } = this.filterForm.value;
    if (!semesterId || !ageGroupId) {
      this.columns.set([]);
      this.rows.set([]);
      return;
    }
    this.loading.set(true);
    this.sheetEndpoints.getMatrix(semesterId, ageGroupId).subscribe({
      next: response => {
        const columnsMap = new Map<number, MatrixColumn>();
        const rowsMap = new Map<number, MatrixRow>();

        for (const cell of response.cells) {
          if (!columnsMap.has(cell.classId)) {
            columnsMap.set(cell.classId, { classId: cell.classId, section: cell.section });
          }
          if (!rowsMap.has(cell.subjectAgeGroupId)) {
            rowsMap.set(cell.subjectAgeGroupId, {
              subjectAgeGroupId: cell.subjectAgeGroupId,
              subjectName: cell.subjectName,
              cellsByClass: new Map(),
            });
          }
          rowsMap.get(cell.subjectAgeGroupId)!.cellsByClass.set(cell.classId, cell);
        }

        this.columns.set(Array.from(columnsMap.values()).sort((a, b) => a.section - b.section));
        this.rows.set(Array.from(rowsMap.values()).sort((a, b) => a.subjectName.localeCompare(b.subjectName)));
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  private syncUrl(): void {
    const { semesterId, ageGroupId } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        semesterId: semesterId ?? null,
        ageGroupId: ageGroupId ?? null,
      },
      queryParamsHandling: 'replace',
    });
  }
}
