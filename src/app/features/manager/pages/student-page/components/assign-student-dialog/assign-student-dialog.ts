import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { ClassEndpoints } from '../../../../shared/endpoints/class-endpoint';
import { Language } from '../../../../../../core/services/language';
import { ClassModel } from '../../../../shared/endpoints/models/class/class-model';
import { AssignmentFilter } from '../../view-model/assignment-filter';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { AccountsEndpoints } from '../../../../shared/endpoints/accounts-endpoint';
import { SelectedAcademicYearService } from '../../../../../../core/services/selected-academic-year.service';

@Component({
  selector: 'app-account-code-dialog',
  imports: [
    MatDialogContent, MatFormField, MatLabel, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
  ],
  templateUrl: './assign-student-dialog.html',
})
export class AssignStudentDialog implements OnInit {
  loading = signal<boolean>(false);
  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  classEndpoints = inject(ClassEndpoints);
  accountEndpoint = inject(AccountsEndpoints);
  dialogRef = inject(MatDialogRef<AssignStudentDialog>);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);
  academicYearSvc = inject(SelectedAcademicYearService);

  existingCode = signal<boolean>(true);
  key: string = crypto.randomUUID();

  class$ = of<ClassModel[]>([]);
  student$ = of<{ id: number; fullName: string }[]>([]);

  headerTable: string[] = ['ageGrouoName', 'academicYear', 'section', 'createdAt', 'action'];
  classes = signal<ClassModel[]>([]);

  filter = signal<AssignmentFilter>({ pageNumber: 1, pageSize: 10 });
  totalPages = signal<number>(1);

  ngOnInit() {
    if (this.data.accountId) {
      this.loadClassesForAccount();
    }
    this.initiateForm();
    this.setupAutocompletes();
  }

  loadClassesForAccount() {
    this.loading.set(true);
    this.classEndpoints.getByAccountIdYear(1, 10, this.data.accountId).subscribe({
      next: (success) => {
        this.classes.set(success.content);
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  initiateForm() {
    this.form = this.fb.group({
      classId: ['', this.data.accountId ? [Validators.required] : []],
      class: [''],
      studentId: ['', this.data.classId ? [Validators.required] : []],
      student: [''],
    });
  }

  setupAutocompletes() {
    this.class$ = this.form.get('class')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(() => {
        const academicYearId = this.academicYearSvc.selectedId();
        return academicYearId
          ? this.classEndpoints.getClassesForStudentAgeGroup(this.data.accountId, academicYearId, 1, 20).pipe(map(r => r.content))
          : of([] as ClassModel[]);
      }),
    );

    if (this.data.classId) {
      this.student$ = this.form.get('student')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap(value => {
          const name = typeof value === 'string' ? value : null;
          return this.classEndpoints.getStudentsByClassId(this.data.classId, name, 1, 20);
        }),
        map(response => response.content),
      );
    }
  }

  submit() {
    const academicYearId = this.academicYearSvc.selectedId();
    if (!academicYearId) return;

    this.loading.set(true);

    const call = this.data.classId
      ? this.accountEndpoint.assignStudent(this.form.get('studentId')!.value, this.data.classId, this.key, academicYearId)
      : this.accountEndpoint.assignStudent(this.data.accountId, this.form.get('classId')!.value, this.key, academicYearId);

    call.subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close({ reload: true });
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  UnassingAccount(id: number) {
    this.loading.set(true);
    this.accountEndpoint.unassingAccount(this.data.accountId, id).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.classes.update(x => x.filter(x => x.id !== id));
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  onClassSelected(event: any) {
    this.form.patchValue({ classId: event.option.value.id });
  }

  onStudentSelected(event: any) {
    this.form.patchValue({ studentId: event.option.value.id });
  }

  displayClass(item: ClassModel): string {
    return item ? `${item.ageGroupName} ${item.section}` : '';
  }

  displayStudent(item: { id: number; fullName: string }): string {
    return item?.fullName ?? '';
  }

  changeInPage(pageEvent: PageEvent) {
    this.filter.update(x => {
      x.pageSize = pageEvent.pageSize;
      x.pageNumber = pageEvent.pageIndex + 1;
      return x;
    });
    this.loadClassesForAccount();
  }
}
