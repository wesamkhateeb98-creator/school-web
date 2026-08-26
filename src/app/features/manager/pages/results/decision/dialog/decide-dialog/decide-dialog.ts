import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Language } from '../../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../core/consts';
import { ResultsEndpoints } from '../../../../../shared/endpoints/results-endpoint';

export interface DecideDialogData {
  studentIds: number[];
  passed: boolean;
  academicYearId: number;
}

@Component({
  selector: 'app-decide-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressBarModule],
  templateUrl: './decide-dialog.html',
})
export class DecideDialog {
  language = inject(Language);
  data = inject<DecideDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<DecideDialog>);
  matSnackBar = inject(MatSnackBar);
  resultsEndpoints = inject(ResultsEndpoints);
  fb = inject(FormBuilder);

  loading = signal(false);

  form: FormGroup = this.fb.group({
    note: ['', [Validators.required, this.notBlankValidator]],
  });

  private notBlankValidator(control: { value: string }) {
    return control.value && control.value.trim().length > 0 ? null : { required: true };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const note = this.form.value.note;
    forkJoin(
      this.data.studentIds.map(studentId =>
        this.resultsEndpoints.decide(studentId, {
          academicYearId: this.data.academicYearId,
          passed: this.data.passed,
          note,
        }),
      ),
    ).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.loading.set(false);
        this.dialogRef.close({ reload: true });
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }
}
