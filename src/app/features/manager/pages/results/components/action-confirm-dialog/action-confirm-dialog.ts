import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Language } from '../../../../../../core/services/language';
import { PhrasesType } from '../../../../../../core/resource/phrases';

export interface ActionConfirmDialogData {
  title: PhrasesType;
  message: PhrasesType;
  confirmLabel: PhrasesType;
  action: () => void;
}

@Component({
  selector: 'app-action-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './action-confirm-dialog.html',
})
export class ActionConfirmDialog {
  language = inject(Language);
  data = inject<ActionConfirmDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ActionConfirmDialog>);

  loading = signal(false);

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.loading.set(true);
    this.data.action();
  }
}
