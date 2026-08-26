import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../core/consts';
import { ClassEndpoints } from '../../../../../shared/endpoints/class-endpoint';
import { ClassModel } from '../../../../../shared/endpoints/models/class/class-model';
import { AgeGroupModel } from '../../../../../shared/endpoints/models/age-group/age-group-model';
import { AcademicYearModel } from '../../../../academic-year/model/academic-year-model';
import { GetSemesterByAcademicYearModel } from '../../../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../../../../shared/endpoints/student-mark-sheet-endpoint';

export interface GenerateSheetsDialogData {
  semesters: GetSemesterByAcademicYearModel[];
  ageGroupItems: AgeGroupModel[];
  selectedSemesterId: number | null;
  selectedAgeGroupId: number | null;
  selectedClassId: number | null;
}

@Component({
  selector: 'app-generate-sheets-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatProgressBarModule],
  templateUrl: './generate-sheets-dialog.html',
})
export class GenerateSheetsDialog implements OnInit {
  language = inject(Language);
  data = inject<GenerateSheetsDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<GenerateSheetsDialog>);
  matSnackBar = inject(MatSnackBar);
  classEndpoints = inject(ClassEndpoints);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);
  fb = inject(FormBuilder);

  loading = signal(false);
  classItems = signal<ClassModel[]>([]);
  resultCount = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    semesterId: [null, Validators.required],
    ageGroupId: [null, Validators.required],
    classId: [null],
  });

  ngOnInit(): void {
    this.form.patchValue({
      semesterId: this.data.selectedSemesterId,
      ageGroupId: this.data.selectedAgeGroupId,
      classId: this.data.selectedClassId,
    });
    if (this.data.selectedAgeGroupId) this.loadClasses(this.data.selectedAgeGroupId);
  }

  onAgeGroupChange(): void {
    const ageGroupId = this.form.value.ageGroupId;
    this.form.patchValue({ classId: null }, { emitEvent: false });
    this.classItems.set([]);
    if (ageGroupId) this.loadClasses(ageGroupId);
  }

  private loadClasses(ageGroupId: number): void {
    // The advisor role can't call /academic-year (admin-only) — the current year is
    // read off the semester list handed in by the parent screen instead.
    const academicYearId = this.data.semesters[0]?.academicYearId;
    this.classEndpoints.get({
      ageGroup: { id: ageGroupId } as AgeGroupModel,
      academicYear: academicYearId ? ({ id: academicYearId } as AcademicYearModel) : undefined,
      pageNumber: 1,
      pageSize: 100,
    }).subscribe({
      next: page => this.classItems.set(page.content),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { semesterId, ageGroupId, classId } = this.form.value;
    this.loading.set(true);
    this.sheetEndpoints.generate(semesterId, ageGroupId, classId ?? null).subscribe({
      next: response => {
        this.resultCount.set(response.count);
        this.loading.set(false);
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close({ reload: this.resultCount() !== null });
  }
}
