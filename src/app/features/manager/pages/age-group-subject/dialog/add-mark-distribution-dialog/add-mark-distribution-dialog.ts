import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { Language } from '../../../../../../core/services/language';
import { SubjectMarkDistributionEndpoints } from '../../../../shared/endpoints/subject-mark-distribution-endpoint';
import { SubjectMarkDistributionViewModel } from '../../model/subject-mark-distribution-view-model';

@Component({
  selector: 'app-add-mark-distribution-dialog',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-mark-distribution-dialog.html',
})
export class AddMarkDistributionDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA);

  // data: { subjectAgeGroupId, maxGrade, totalEnteredGrade, record? }

  /** العلامة العظمى المسموح بإدخالها حسب المتبقي */
  maxAllowedGrade: number;

  get markTypes() {
    return [
      { id: 1, name: this.language.transform('coursework_title') },
      { id: 2, name: this.language.transform('final_exam_title') },
    ];
  }

  constructor(
    public dialogRef: MatDialogRef<AddMarkDistributionDialog>,
    public language: Language,
    public fb: FormBuilder,
    public matSnackBar: MatSnackBar,
    public endpoint: SubjectMarkDistributionEndpoints
  ) {
    const { maxGrade, totalEnteredGrade, record } = this.data;

    // عند التعديل: نُعيد إضافة علامة السجل الحالي للمتبقي
    const currentRecordGrade = this.isUpdate() ? record.percentage * maxGrade : 0;
    this.maxAllowedGrade = maxGrade - totalEnteredGrade + currentRecordGrade;

    const initialGrade = this.isUpdate() ? +(record.percentage * maxGrade).toFixed(4) : null;

    this.form = this.fb.group({
      name: [
        this.isUpdate() ? record.name : '',
        [Validators.required, Validators.maxLength(100)],
      ],
      grade: [
        initialGrade,
        [
          Validators.required,
          Validators.min(0.0001),
          Validators.max(this.maxAllowedGrade),
        ],
      ],
      markType: [
        this.isUpdate() ? record.markType : null,
        [Validators.required],
      ],
    });
  }

  isUpdate(): boolean {
    return this.data?.record != null;
  }

  name()     { return this.form.get('name'); }
  grade()    { return this.form.get('grade'); }
  markType() { return this.form.get('markType'); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (!this.form.valid) return;
    this.loading.set(true);
    this.isUpdate() ? this.update() : this.add();
  }

  private add(): void {
    const { name, grade, markType } = this.form.value;
    const percentage = +(grade / this.data.maxGrade).toFixed(4);

    this.endpoint.add(this.data.subjectAgeGroupId, name, percentage, markType).subscribe({
      next: (success) => {
        this.matSnackBar.open(
          this.language.transform('success'),
          this.language.transform('close'),
          successMatSnackbarConfig(this.language)
        );
        const data = new SubjectMarkDistributionViewModel(
          success.id,
          this.data.subjectAgeGroupId,
          name,
          percentage,
          markType,
          new Date()
        );
        this.dialogRef.close({ data });
      },
      error: (error) => {
        this.matSnackBar.open(
          error.error?.Title ?? error.message,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language)
        );
        this.loading.set(false);
      },
    });
  }

  private update(): void {
    const { name, grade, markType } = this.form.value;
    const percentage = +(grade / this.data.maxGrade).toFixed(4);

    this.endpoint.update(this.data.record.id, name, percentage, markType).subscribe({
      next: (success) => {
        this.matSnackBar.open(
          this.language.transform('success'),
          this.language.transform('close'),
          successMatSnackbarConfig(this.language)
        );
        const data = new SubjectMarkDistributionViewModel(
          success.id,
          this.data.subjectAgeGroupId,
          name,
          percentage,
          markType,
          this.data.record.createdAt
        );
        this.dialogRef.close({ data });
      },
      error: (error) => {
        this.matSnackBar.open(
          error.error?.Title ?? error.message,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language)
        );
        this.loading.set(false);
      },
    });
  }
}
