import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentMarkEntryEndpoints } from '../../../../shared/endpoints/student-mark-entry-endpoint';

export interface EditMarkDialogData {
  studentId: number;
  distributionId: number;
  distributionName: string;
  enteredValue: number | null;
  maxValue: number;
}

@Component({
  selector: 'app-edit-mark-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-mark-dialog.html',
})
export class EditMarkDialog {
  dialogRef  = inject(MatDialogRef<EditMarkDialog>);
  data: EditMarkDialogData = inject(MAT_DIALOG_DATA);
  language   = inject(Language);
  matSnackBar = inject(MatSnackBar);
  endpoints  = inject(StudentMarkEntryEndpoints);

  loading = signal(false);

  valueControl = new FormControl<number | null>(this.data.enteredValue, [
    Validators.required,
    Validators.min(0),
    Validators.max(this.data.maxValue),
  ]);

  onNoClick() { this.dialogRef.close(); }

  submit() {
    if (this.valueControl.invalid) { this.valueControl.markAsTouched(); return; }
    if (this.loading()) return;
    this.loading.set(true);

    this.endpoints.update(this.data.studentId, this.data.distributionId, this.valueControl.value!).subscribe({
      next: () => {
        this.loading.set(false);
        this.matSnackBar.open(
          this.language.transform('success'),
          this.language.transform('close'),
          successMatSnackbarConfig(this.language),
        );
        this.dialogRef.close({ updated: true, value: this.valueControl.value });
      },
      error: err => {
        this.loading.set(false);
        this.matSnackBar.open(
          err.error?.Title ?? err.message,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language),
        );
      },
    });
  }
}
