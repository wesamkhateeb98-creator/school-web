import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Language } from '../../../../../../core/services/language';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcademicYearEndpoints } from '../../../../shared/endpoints/academic-year-endpoints';
import { SemesterForAcademicYearViewModel } from '../../model/semester-for-academic-year-view-model';
import { errorMatSnackbarConfig, StringToDate, successMatSnackbarConfig } from '../../../../../../core/consts';

@Component({
  selector: 'app-active-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './active-dialog.html'
})
export class ActiveDialog {
  loading = signal<boolean>(false);
  semesters = signal<SemesterForAcademicYearViewModel[]>([]);

  data = inject(MAT_DIALOG_DATA);
  form: FormGroup;

  constructor(
    public language: Language,
    public dialogRef: MatDialogRef<ActiveDialog>,
    public academicYearEndpoints: AcademicYearEndpoints,
    public matSnackBar: MatSnackBar,
    public fb: FormBuilder
  ) {
    this.form = this.fb.group({
      semesterId: [null, [Validators.required]]
    });

    this.loadSemesters();
  }

  loadSemesters() {
    this.loading.set(true);
    this.academicYearEndpoints.getSemester(this.data.academicYearId, 1, 100).subscribe({
      next: result => {
        this.semesters.set(
          result.content.map(x => ({
            id: x.id,
            startDate: StringToDate(x.startDate),
            endDate: StringToDate(x.endDate),
            semesterId: x.semesterId,
            semesterName: x.semesterName,
            status: x.status,
            createdAt: new Date(x.createdAt)
          } as SemesterForAcademicYearViewModel))
        );
        this.loading.set(false);
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (!this.form.valid) return;

    this.loading.set(true);
    this.academicYearEndpoints.active(this.data.academicYearId, this.form.value.semesterId).subscribe({
      next: success => {
        this.matSnackBar.open('success', this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close({ success: true });
        this.loading.set(false);
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }
}
