import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentMarkSheetEndpoints } from '../../../../shared/endpoints/student-mark-sheet-endpoint';
import { MarkSheetReportResponse } from '../../../../shared/endpoints/models/student-mark-sheet/mark-sheet-report-response';

export interface PublishDialogData {
  semesterId: number;
}

@Component({
  selector: 'app-publish-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
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
  dialogRef   = inject(MatDialogRef<PublishDialog>);
  data: PublishDialogData = inject(MAT_DIALOG_DATA);
  language    = inject(Language);
  matSnackBar = inject(MatSnackBar);
  endpoints   = inject(StudentMarkSheetEndpoints);

  reportLoading  = signal(false);
  releaseLoading = signal(false);
  report         = signal<MarkSheetReportResponse | null>(null);

  pendingColumns = ['subjectName', 'hasSheet', 'isConfirmed'];

  ngOnInit() {
    this.loadReport();
  }

  private loadReport() {
    this.reportLoading.set(true);
    this.endpoints.getReport(this.data.semesterId).subscribe({
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
    if (this.releaseLoading()) return;
    this.releaseLoading.set(true);
    this.endpoints.release(this.data.semesterId).subscribe({
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
