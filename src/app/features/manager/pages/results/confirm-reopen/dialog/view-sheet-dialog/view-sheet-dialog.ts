import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../core/consts';
import { StudentMarkSheetEndpoints } from '../../../../../shared/endpoints/student-mark-sheet-endpoint';
import { MarkSheetDetailResponse } from '../../../../../shared/endpoints/models/student-mark-sheet/mark-sheet-detail-response';
import { MarkSheetStatus } from '../../../../../../../core/enums/mark-sheet-status';
import { ActionConfirmDialog } from '../../../components/action-confirm-dialog/action-confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

export interface ViewSheetDialogData {
  sheetId: number;
}

@Component({
  selector: 'app-view-sheet-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './view-sheet-dialog.html',
  styleUrl: './view-sheet-dialog.scss',
})
export class ViewSheetDialog implements OnInit {
  language = inject(Language);
  data = inject<ViewSheetDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ViewSheetDialog>);
  matSnackBar = inject(MatSnackBar);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);
  dialog = inject(MatDialog);

  loading = signal(true);
  detail = signal<MarkSheetDetailResponse | null>(null);
  hasBeenViewed = signal(false);

  MarkSheetStatus = MarkSheetStatus;

  ngOnInit(): void {
    this.sheetEndpoints.getById(this.data.sheetId).subscribe({
      next: response => {
        this.detail.set(response);
        this.loading.set(false);
        this.hasBeenViewed.set(true);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  cellValue(row: MarkSheetDetailResponse['rows'][number], distributionId: number): number | null {
    return row.cells.find(c => c.distributionId === distributionId)?.value ?? null;
  }

  confirm(): void {
    const detail = this.detail();
    if (!detail) return;
    this.sheetEndpoints.confirm(detail.sheet.id).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close({ reload: true });
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      },
    });
  }

  openReopenConfirm(): void {
    const detail = this.detail();
    if (!detail) return;
    const ref = this.dialog.open(ActionConfirmDialog, {
      width: '40%',
      data: {
        title: 'reopen_action_title',
        message: 'reopen_warning_message',
        confirmLabel: 'reopen_action_title',
        action: () => {
          this.sheetEndpoints.reopen(detail.sheet.id).subscribe({
            next: () => {
              this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
              ref.close();
              this.dialogRef.close({ reload: true });
            },
            error: err => {
              this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            },
          });
        },
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
