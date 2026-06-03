import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { AgeGroupEndpoints } from '../../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../../shared/endpoints/models/age-group/age-group-model';
import { SubjectAgeGroupModel } from '../../../../shared/endpoints/models/age-group/subject-age-group-model';
import { GetSemesterByAcademicYearModel } from '../../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../../../shared/endpoints/student-mark-sheet-endpoint';
import { StudentMarkSheetModel } from '../../../../shared/endpoints/models/student-mark-sheet/student-mark-sheet-model';

export interface StudentMarkSheetFormDialogData {
  semesters:          GetSemesterByAcademicYearModel[];
  selectedSemesterId: number | null;
  record?:            StudentMarkSheetModel;
}

@Component({
  selector: 'app-student-mark-sheet-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-mark-sheet-form-dialog.html',
})
export class StudentMarkSheetFormDialog implements OnInit {
  dialogRef         = inject(MatDialogRef<StudentMarkSheetFormDialog>);
  data: StudentMarkSheetFormDialogData = inject(MAT_DIALOG_DATA);
  language          = inject(Language);
  fb                = inject(FormBuilder);
  matSnackBar       = inject(MatSnackBar);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  sheetEndpoints    = inject(StudentMarkSheetEndpoints);

  loading         = signal(false);
  subjectsLoading = signal(false);
  ageGroupItems   = signal<AgeGroupModel[]>([]);
  subjectItems    = signal<SubjectAgeGroupModel[]>([]);

  form!: FormGroup;
  key = crypto.randomUUID();

  private currentAgeGroupId: number | null = null;

  get isEdit() { return !!this.data.record; }
  get semesters() { return this.data.semesters; }

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  displayAgeGroup = (g: AgeGroupModel | string | null): string =>
    !g || typeof g === 'string' ? ((g as string) ?? '') : g.name;

  displaySubject = (s: SubjectAgeGroupModel | string | null): string =>
    !s || typeof s === 'string' ? ((s as string) ?? '') : s.subjectName;

  ngOnInit() {
    const r = this.data.record;

    this.form = this.fb.group({
      semesterId:        [this.data.selectedSemesterId, Validators.required],
      ageGroupSearch:    [r ? r.ageGroupName : ''],
      subjectAgeGroupId: [r?.subjectAgeGroupId ?? null, Validators.required],
      subjectSearch:     [{ value: r ? r.subjectName : '', disabled: !r }],
    });

    if (r) {
      this.currentAgeGroupId = r.ageGroupId;
      this.loadSubjects(r.ageGroupId, null);
    }

    this.form.get('ageGroupSearch')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      if (typeof val === 'string') {
        this.ageGroupEndpoints.get(val.trim(), 1, 100).subscribe({
          next: page => this.ageGroupItems.set(page.content),
        });
      }
    });

    this.form.get('subjectSearch')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      if (typeof val === 'string' && this.currentAgeGroupId) {
        this.loadSubjects(this.currentAgeGroupId, val.trim());
      }
    });
  }

  onAgeGroupFocus() {
    if (this.ageGroupItems().length === 0) {
      this.ageGroupEndpoints.get('', 1, 100).subscribe({
        next: page => this.ageGroupItems.set(page.content),
      });
    }
  }

  onAgeGroupSelected(group: AgeGroupModel) {
    this.currentAgeGroupId = group.id;
    this.form.patchValue({ subjectAgeGroupId: null, subjectSearch: '' });
    this.subjectItems.set([]);
    this.form.get('subjectSearch')!.enable({ emitEvent: false });
    this.loadSubjects(group.id, null);
  }

  clearAgeGroup() {
    this.currentAgeGroupId = null;
    this.form.patchValue({ ageGroupSearch: null, subjectAgeGroupId: null, subjectSearch: null });
    this.form.get('subjectSearch')!.disable({ emitEvent: false });
    this.subjectItems.set([]);
  }

  onSubjectSelected(subject: SubjectAgeGroupModel) {
    this.form.patchValue({ subjectAgeGroupId: subject.subjectAgeGroupId });
  }

  clearSubject() {
    this.form.patchValue({ subjectSearch: '', subjectAgeGroupId: null });
    if (this.currentAgeGroupId) this.loadSubjects(this.currentAgeGroupId, null);
  }

  private loadSubjects(ageGroupId: number, name: string | null) {
    this.subjectsLoading.set(true);
    this.ageGroupEndpoints.getSubjectAgeGroups(ageGroupId, name, 1, 200).subscribe({
      next: page => { this.subjectItems.set(page.content); this.subjectsLoading.set(false); },
      error: () => this.subjectsLoading.set(false),
    });
  }

  onNoClick() { this.dialogRef.close(); }

  submit() {
    if (!this.form.valid) { this.form.markAllAsTouched(); return; }
    if (this.loading()) return;
    this.loading.set(true);

    const { semesterId, subjectAgeGroupId } = this.form.value;

    const obs = this.isEdit
      ? this.sheetEndpoints.update(this.data.record!.id, subjectAgeGroupId, semesterId)
      : this.sheetEndpoints.add(this.key, subjectAgeGroupId, semesterId);

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close({ reload: true });
      },
      error: err => {
        this.loading.set(false);
        this.matSnackBar.open(err.error?.Title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      },
    });
  }
}
