import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { successMatSnackbarConfig } from '../../../../../../core/consts';
import { AssignmentEndpoints } from '../../../../shared/endpoints/assignment-endpoint';
import { StudentAssignmentAutoComplete } from '../../../../shared/components/student-assignment-auto-complete/student-assignment-auto-complete';
import { StudentEvaluationResponse } from '../../model/assignment.model';

@Component({
  selector: 'app-add-evaluation-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    StudentAssignmentAutoComplete,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-evaluation-dialog.html',
})
export class AddEvaluationDialog {
  dialogRef = inject(MatDialogRef<AddEvaluationDialog>);
  data: { classAssignmentId: number; evaluation?: StudentEvaluationResponse } = inject(MAT_DIALOG_DATA);
  language            = inject(Language);
  fb                  = inject(FormBuilder);
  matSnackBar         = inject(MatSnackBar);
  assignmentEndpoints = inject(AssignmentEndpoints);

  loading      = signal(false);
  errorMessage = signal<string | null>(null);

  get isEdit() { return !!this.data.evaluation; }

  form = this.fb.group({
    studentId:       [this.data.evaluation?.studentId ?? null as number | null, Validators.required],
    evaluationRatio: [this.data.evaluation?.evaluationRatio ?? null as number | null, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    description:     [this.data.evaluation?.description ?? '', Validators.maxLength(1000)],
  });

  onNoClick() { this.dialogRef.close(); }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const obs = this.isEdit
      ? this.assignmentEndpoints.updateStudentEvaluation(this.data.evaluation!.id, {
          classAssignmentId: this.data.classAssignmentId,
          studentId:         this.form.value.studentId!,
          evaluationRatio:   this.form.value.evaluationRatio!,
          description:       this.form.value.description || undefined,
        })
      : this.assignmentEndpoints.addStudentEvaluation({
          key:               crypto.randomUUID(),
          classAssignmentId: this.data.classAssignmentId,
          studentId:         this.form.value.studentId!,
          evaluationRatio:   this.form.value.evaluationRatio!,
          description:       this.form.value.description || undefined,
        });

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.matSnackBar.open(
          this.language.transform('success'),
          this.language.transform('close'),
          successMatSnackbarConfig(this.language),
        );
        this.dialogRef.close({ reload: true });
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}
