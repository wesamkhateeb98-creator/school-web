import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { Language } from "../../../../../../core/services/language";
import { MatSnackBar } from "@angular/material/snack-bar";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { AgeGroupEndpoints } from "../../../../shared/endpoints/age-group-endpoint";
import { AcademicYearSemesterAutoComplete } from "../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: 'app-add-study-plan-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressBarModule, MatIconModule,
    AcademicYearSemesterAutoComplete
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-study-plan-dialog.html',
})
export class AddStudyPlanDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;

  data = inject(MAT_DIALOG_DATA);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  dialogRef = inject(MatDialogRef<AddStudyPlanDialog>);

  constructor() {
    this.form = this.fb.group({
      weekNumber: [1, [Validators.required, Validators.min(1)]],
      titles: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  get titles(): FormArray {
    return this.form.get('titles') as FormArray;
  }

  addTitle() {
    this.titles.push(this.fb.control('', Validators.required));
  }

  removeTitle(index: number) {
    if (this.titles.length > 1) {
      this.titles.removeAt(index);
    }
  }

  submit() {
    if (!this.form.valid) return;

    this.loading.set(true);

    const body = {
      key: crypto.randomUUID(),
      semesterId: this.form.value.semesterId,
      weeks: [{
        weekNumber: +this.form.value.weekNumber,
        title: this.form.value.titles as string[]
      }]
    };

    this.ageGroupEndpoints.addStudyPlan(this.data.ageGroupId, this.data.ageGroupSubjectId, body)
      .subscribe({
        next: () => {
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          this.dialogRef.close({ reload: true });
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
