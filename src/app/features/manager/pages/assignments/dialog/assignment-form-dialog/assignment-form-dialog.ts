import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig, ToDateOnly } from '../../../../../../core/consts';
import { AssignmentEndpoints } from '../../../../shared/endpoints/assignment-endpoint';
import { ClassEndpoints } from '../../../../shared/endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../../../shared/endpoints/age-group-endpoint';
import { ClassModel } from '../../../../shared/endpoints/models/class/class-model';
import { SubjectForAgeGroupModel } from '../../../../shared/endpoints/models/age-group/subject-for-age-group-model';
import { AssignmentType, AssignmentResponse, ASSIGNMENT_TYPE_LABELS } from '../../model/assignment.model';
import { AcademicYearSemesterAutoComplete } from '../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';

@Component({
  selector: 'app-assignment-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressBarModule,
    AcademicYearSemesterAutoComplete,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-form-dialog.html',
})
export class AssignmentFormDialog implements OnInit {
  dialogRef       = inject(MatDialogRef<AssignmentFormDialog>);
  data: { assignment?: AssignmentResponse } = inject(MAT_DIALOG_DATA);
  language        = inject(Language);
  fb              = inject(FormBuilder);
  matSnackBar     = inject(MatSnackBar);
  assignmentEndpoints = inject(AssignmentEndpoints);
  classEndpoints  = inject(ClassEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  loading         = signal(false);
  classes         = signal<ClassModel[]>([]);
  subjects        = signal<SubjectForAgeGroupModel[]>([]);
  subjectsLoading = signal(false);

  form!: FormGroup;

  assignmentTypes = Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({
    value: +value as AssignmentType,
    label,
  }));

  get isEdit() { return !!this.data?.assignment; }

  ngOnInit() {
    const a = this.data?.assignment;
    this.form = this.fb.group({
      title:            [a?.title ?? '',            [Validators.required, Validators.maxLength(200)]],
      description:      [a?.description ?? '',      [Validators.maxLength(1000)]],
      type:             [a?.type ?? null,            Validators.required],
      assignmentAt:     [a ? new Date(a.assignmentAt) : null, Validators.required],
      requiredTime:     [a?.requiredTime ?? false],
      classId:          [a?.classId ?? null],
      subjectAgeGroupId:[a?.subjectAgeGroupId ?? null, Validators.required],
    });

    this.classEndpoints.getByOpenAcademicYear(1, 100).subscribe({
      next: res => {
        this.classes.set(res.content);
        if (a?.classId) this.loadSubjectsForClass(a.classId);
      },
    });

    this.form.get('classId')!.valueChanges.subscribe(classId => {
      this.subjects.set([]);
      this.form.patchValue({ subjectAgeGroupId: null }, { emitEvent: false });
      if (classId) this.loadSubjectsForClass(classId);
    });
  }

  loadSubjectsForClass(classId: number) {
    this.subjectsLoading.set(true);
    this.classEndpoints.getByIdClassForAdmin(classId).subscribe({
      next: cls => {
        this.ageGroupEndpoints.getSubjects(cls.ageGroupId, 1, 100).subscribe({
          next: res => {
            this.subjects.set(res.content);
            this.subjectsLoading.set(false);
          },
          error: () => this.subjectsLoading.set(false),
        });
      },
      error: () => this.subjectsLoading.set(false),
    });
  }

  displayClass(cls: ClassModel): string {
    return cls ? `${cls.ageGroupName} - ${cls.section}` : '';
  }

  onNoClick() { this.dialogRef.close(); }

  submit() {
    if (!this.form.valid) return;
    this.loading.set(true);

    const assignmentAt = ToDateOnly(this.form.value.assignmentAt);

    if (this.isEdit) {
      this.assignmentEndpoints.update(this.data.assignment!.id, {
        title:            this.form.value.title,
        description:      this.form.value.description || undefined,
        type:             this.form.value.type,
        assignmentAt,
        requiredTime:     this.form.value.requiredTime,
        classId:          this.form.value.classId || undefined,
        subjectAgeGroupId: this.form.value.subjectAgeGroupId,
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
          this.dialogRef.close({ reload: true });
        },
        error: err => {
          this.loading.set(false);
          this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        },
      });
    } else {
      this.assignmentEndpoints.add({
        key:              crypto.randomUUID(),
        title:            this.form.value.title,
        description:      this.form.value.description || undefined,
        type:             this.form.value.type,
        assignmentAt,
        requiredTime:     this.form.value.requiredTime,
        classId:          this.form.value.classId || undefined,
        subjectAgeGroupId: this.form.value.subjectAgeGroupId,
        academicYearSemesterId: this.form.value.semesterId,
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
          this.dialogRef.close({ reload: true });
        },
        error: err => {
          this.loading.set(false);
          this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        },
      });
    }
  }
}
