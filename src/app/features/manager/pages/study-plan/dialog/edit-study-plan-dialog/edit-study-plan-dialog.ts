import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { MatSnackBar } from "@angular/material/snack-bar";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { AgeGroupEndpoints } from "../../../../shared/endpoints/age-group-endpoint";

@Component({
  selector: 'app-edit-study-plan-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-study-plan-dialog.html',
})
export class EditStudyPlanDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;

  data = inject(MAT_DIALOG_DATA);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  dialogRef = inject(MatDialogRef<EditStudyPlanDialog>);

  constructor() {
    this.form = this.fb.group({
      title: [this.data.currentTitle, [Validators.required]],
    });
  }

  submit() {
    if (!this.form.valid) return;

    this.loading.set(true);
    const title: string = this.form.value.title;

    this.ageGroupEndpoints.updateStudyPlan(
      this.data.ageGroupId,
      this.data.ageGroupSubjectId,
      this.data.studyPlanId,
      title
    ).subscribe({
      next: () => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close({ studyPlanId: this.data.studyPlanId, newTitle: title });
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
