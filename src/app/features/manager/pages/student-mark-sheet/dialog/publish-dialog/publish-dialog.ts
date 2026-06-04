import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentMarkSheetEndpoints } from '../../../../shared/endpoints/student-mark-sheet-endpoint';
import { SemesterEndpoints } from '../../../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { MarkSheetReportResponse } from '../../../../shared/endpoints/models/student-mark-sheet/mark-sheet-report-response';

@Component({
  selector: 'app-publish-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publish-dialog.html',
})
export class PublishDialog implements OnInit {
  dialogRef    = inject(MatDialogRef<PublishDialog>);
  language     = inject(Language);
  matSnackBar  = inject(MatSnackBar);
  sheetEndpoints  = inject(StudentMarkSheetEndpoints);
  semesterEndpoints = inject(SemesterEndpoints);

  semesters      = signal<GetSemesterByAcademicYearModel[]>([]);
  semestersLoading = signal(false);
  selectedSemesterId: number | null = null;

  reportLoading  = signal(false);
  releaseLoading = signal(false);
  report         = signal<MarkSheetReportResponse | null>(null);

  pendingColumns = ['subjectName', 'hasSheet', 'isConfirmed'];

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  ngOnInit() {
    this.loadSemesters();
  }

  private loadSemesters() {
    this.semestersLoading.set(true);
    this.semesterEndpoints.getSemesterByAcademicYear({
      year: undefined, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        this.semestersLoading.set(false);
        // auto-select active semester
        const active = page.content.find(s => s.isActive);
        if (active) {
          this.selectedSemesterId = active.academicYearSemesterId;
          this.loadReport();
        }
      },
      error: () => this.semestersLoading.set(false),
    });
  }

  onSemesterChange(id: number) {
    this.selectedSemesterId = id;
    this.report.set(null);
    this.loadReport();
  }

  private loadReport() {
    if (!this.selectedSemesterId) return;
    this.reportLoading.set(true);
    this.sheetEndpoints.getReport(this.selectedSemesterId).subscribe({
      next: res => { this.report.set(res); this.reportLoading.set(false); },
      error: err => {
        this.reportLoading.set(false);
        this.matSnackBar.open(
          err.message ?? err.error?.Title,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language),
        );
      },
    });
  }

  release() {
    if (!this.selectedSemesterId || this.releaseLoading()) return;
    this.releaseLoading.set(true);
    this.sheetEndpoints.release(this.selectedSemesterId).subscribe({
      next: res => {
        this.releaseLoading.set(false);
        this.matSnackBar.open(
          `${this.language.transform('release_success')} (${res.count})`,
          this.language.transform('close'),
          successMatSnackbarConfig(this.language),
        );
        this.dialogRef.close({ released: true });
      },
      error: err => {
        this.releaseLoading.set(false);
        this.matSnackBar.open(
          err.message ?? err.error?.Title,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language),
        );
      },
    });
  }

  onNoClick() { this.dialogRef.close(); }
}
