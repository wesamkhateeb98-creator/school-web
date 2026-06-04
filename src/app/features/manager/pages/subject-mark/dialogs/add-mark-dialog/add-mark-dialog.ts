import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentMarkEntryEndpoints } from '../../../../shared/endpoints/student-mark-entry-endpoint';
import { SubjectMarkDistributionModel } from '../../../../shared/endpoints/models/age-group/subject-mark-distribution-model';
import { StudentSimpleModel } from '../../../../shared/endpoints/models/student/student-simple-model';

export interface AddMarkDialogData {
  markSheetId: number;
  subjectAgeGroupId: number;
  maxGrade: number;
  distributions: SubjectMarkDistributionModel[];
  prefilledStudentId?: number;
  prefilledStudentName?: string;
}

@Component({
  selector: 'app-add-mark-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-mark-dialog.html',
})
export class AddMarkDialog implements OnInit {
  dialogRef  = inject(MatDialogRef<AddMarkDialog>);
  data: AddMarkDialogData = inject(MAT_DIALOG_DATA);
  language   = inject(Language);
  matSnackBar = inject(MatSnackBar);
  fb         = inject(FormBuilder);
  endpoints  = inject(StudentMarkEntryEndpoints);
  destroyRef = inject(DestroyRef);

  loading         = signal(false);
  studentsLoading = signal(false);
  students        = signal<StudentSimpleModel[]>([]);
  selectedStudentId: number | null = null;

  key = crypto.randomUUID();

  form!: FormGroup;

  get sortedDistributions(): SubjectMarkDistributionModel[] {
    return [...this.data.distributions].sort((a, b) => a.markType - b.markType);
  }

  get entries(): FormArray { return this.form.get('entries') as FormArray; }

  displayFn = (s: StudentSimpleModel | string | null): string => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    return s.fullName;
  };

  maxValueFor(dist: SubjectMarkDistributionModel): number {
    return +(dist.percentage * this.data.maxGrade).toFixed(2);
  }

  markTypeName(dist: SubjectMarkDistributionModel): string {
    return dist.markType === 1
      ? this.language.transform('coursework_title')
      : this.language.transform('final_exam_title');
  }

  ngOnInit() {
    const isPrefilled = !!this.data.prefilledStudentId;
    this.selectedStudentId = this.data.prefilledStudentId ?? null;

    this.form = this.fb.group({
      studentSearch: [
        isPrefilled ? { id: this.data.prefilledStudentId, name: this.data.prefilledStudentName } : null,
        Validators.required,
      ],
      entries: this.fb.array(
        this.sortedDistributions.map(dist =>
          this.fb.group({
            subjectMarkDistributionId: [dist.id],
            value: [
              null,
              [Validators.required, Validators.min(0), Validators.max(this.maxValueFor(dist))],
            ],
          }),
        ),
      ),
    });

    if (isPrefilled) {
      this.form.get('studentSearch')!.disable();
    }

    this.form.get('studentSearch')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        const name = typeof val === 'string' ? val.trim() : '';
        this.studentsLoading.set(true);
        return this.endpoints.getStudents(this.data.subjectAgeGroupId, 1, 20, name || undefined);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: page => {
        this.students.set(page.content);
        this.studentsLoading.set(false);
      },
      error: () => this.studentsLoading.set(false),
    });
  }

  onStudentSelected(student: StudentSimpleModel) {
    this.selectedStudentId = student.id;
  }

  entryControl(index: number): FormControl {
    return this.entries.at(index).get('value') as FormControl;
  }

  onNoClick() { this.dialogRef.close(); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.selectedStudentId) return;
    if (this.loading()) return;

    this.loading.set(true);

    const entriesPayload = (this.entries.value as { subjectMarkDistributionId: number; value: number }[]);

    this.endpoints.add(
      this.key,
      this.data.markSheetId,
      this.selectedStudentId,
      entriesPayload,
    ).subscribe({
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
        this.matSnackBar.open(
          err.error?.Title ?? err.message,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language),
        );
      },
    });
  }
}
