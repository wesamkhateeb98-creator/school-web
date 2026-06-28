import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig, ToDateOnly } from '../../../../../../core/consts';
import { AssignmentEndpoints } from '../../../../shared/endpoints/assignment-endpoint';
import { ClassEndpoints } from '../../../../shared/endpoints/class-endpoint';
import { ClassModel } from '../../../../shared/endpoints/models/class/class-model';
import { AssignmentType, AssignmentResponse, ASSIGNMENT_TYPE_LABELS } from '../../model/assignment.model';
import { AcademicYearSemesterAutoComplete } from '../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';
import { SubjectAgeGroupAutoComplete } from '../../../../shared/components/subject-age-group-auto-complete/subject-age-group-auto-complete';

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
    MatGridListModule,
    MatProgressBarModule,
    AcademicYearSemesterAutoComplete,
    SubjectAgeGroupAutoComplete,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-form-dialog.html',
})
export class AssignmentFormDialog implements OnInit {
  dialogRef           = inject(MatDialogRef<AssignmentFormDialog>);
  data: { assignment?: AssignmentResponse } = inject(MAT_DIALOG_DATA);
  language            = inject(Language);
  fb                  = inject(FormBuilder);
  matSnackBar         = inject(MatSnackBar);
  assignmentEndpoints = inject(AssignmentEndpoints);
  classEndpoints      = inject(ClassEndpoints);
  key = crypto.randomUUID();
  loading  = signal(false);
  classes  = signal<ClassModel[]>([]);
  ageGroupId = signal<number | null>(null);

  form!: FormGroup;

  assignmentTypes = Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({
    value: +value as AssignmentType,
    label,
  }));

  get isEdit() { return !!this.data?.assignment; }

  ngOnInit() {
    const a = this.data?.assignment;
    const existingTime = a?.assignmentTime ? a.assignmentTime.substring(0, 5) : null;

    const hasClassAssignment = !!(a?.classInfo?.id);

    this.form = this.fb.group({
      title:            [a?.title ?? '',            [Validators.required, Validators.maxLength(200)]],
      description:      [a?.description ?? '',      [Validators.maxLength(1000)]],
      type:             [a?.type ?? null,            Validators.required],
      assignmentAt:     [a ? new Date(a.assignmentAt) : null, Validators.required],
      includeTime:      [!!existingTime],
      assignmentTime:   [existingTime ?? ''],
      isClassAssignment:[hasClassAssignment],
      classId:          [a?.classInfo?.id ?? null],
      subjectAgeGroupId:[a?.subjectAgeGroupId ?? null],
    });

    this.toggleClassAssignmentValidators(hasClassAssignment);

    this.form.get('isClassAssignment')!.valueChanges.subscribe(checked => {
      this.toggleClassAssignmentValidators(checked);
      if (!checked) {
        this.form.patchValue({ classId: null, subjectAgeGroupId: null });
        this.ageGroupId.set(null);
      }
    });

    this.classEndpoints.getByOpenAcademicYear(1, 100).subscribe({
      next: res => this.classes.set(res.content),
    });

    if (a?.classInfo?.id) {
      this.classEndpoints.getByIdClassForAdmin(a.classInfo.id).subscribe({
        next: cls => this.ageGroupId.set(cls.ageGroupId),
      });
    }

    this.form.get('classId')!.valueChanges.subscribe(classId => {
      this.ageGroupId.set(null);
      if (classId) {
        this.classEndpoints.getByIdClassForAdmin(classId).subscribe({
          next: cls => this.ageGroupId.set(cls.ageGroupId),
        });
      }
    });
  }

  private toggleClassAssignmentValidators(isClassAssignment: boolean) {
    const subjectCtrl = this.form.get('subjectAgeGroupId')!;
    const classCtrl = this.form.get('classId')!;
    if (isClassAssignment) {
      subjectCtrl.setValidators(Validators.required);
      classCtrl.setValidators(Validators.required);
    } else {
      subjectCtrl.clearValidators();
      classCtrl.clearValidators();
    }
    subjectCtrl.updateValueAndValidity();
    classCtrl.updateValueAndValidity();
  }

  private buildAssignmentAt(): string {
    return ToDateOnly(this.form.value.assignmentAt as Date);
  }

  private buildAssignmentTime(): string | undefined | null {
    if (this.form.value.includeTime && this.form.value.assignmentTime) {
      const time = this.form.value.assignmentTime as string;
      return time.length === 5 ? `${time}:00` : time;
    }
    return this.isEdit ? null : undefined;
  }

  onNoClick() { this.dialogRef.close(); }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.loading()) return;
    this.loading.set(true);

    const assignmentAt = this.buildAssignmentAt();
    const assignmentTime = this.buildAssignmentTime();

    const isClassAssignment = this.form.value.isClassAssignment;

    if (this.isEdit) {
      this.assignmentEndpoints.update(this.data.assignment!.id, {
        title:             this.form.value.title,
        description:       this.form.value.description || undefined,
        type:              this.form.value.type,
        assignmentAt,
        assignmentTime,
        classId:           isClassAssignment ? (this.form.value.classId || undefined) : undefined,
        subjectAgeGroupId: isClassAssignment ? this.form.value.subjectAgeGroupId : undefined,
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
        key:               this.key,
        title:             this.form.value.title,
        description:       this.form.value.description || undefined,
        type:              this.form.value.type,
        assignmentAt,
        assignmentTime:    assignmentTime ?? undefined,
        classId:           isClassAssignment ? (this.form.value.classId || undefined) : undefined,
        subjectAgeGroupId: isClassAssignment ? this.form.value.subjectAgeGroupId : undefined,
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
