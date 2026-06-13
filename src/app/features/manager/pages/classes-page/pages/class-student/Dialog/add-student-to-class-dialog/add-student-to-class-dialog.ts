import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Language } from '../../../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../../core/consts';
import { ClassEndpoints } from '../../../../../../shared/endpoints/class-endpoint';
import { StudentEndpoints } from '../../../../../../shared/endpoints/student-endpoint';

export interface AddStudentToClassDialogData {
  classId: number;
}

@Component({
  selector: 'app-add-student-to-class-dialog',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ language.transform('add_student_to_class') }}</h2>

    <mat-dialog-content style="min-width: 320px; padding-top: 8px;">
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>{{ language.transform('student') }}</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput
          [formControl]="searchCtrl"
          [matAutocomplete]="auto"
          [placeholder]="language.transform('search_student_placeholder')" />
        @if (searching()) {
          <mat-spinner matSuffix diameter="18" style="margin-inline-end: 8px;" />
        }
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onSelect($event.option.value)">
          @for (s of students(); track s.id) {
            <mat-option [value]="s">{{ s.fullName }}</mat-option>
          }
          @if (!searching() && students().length === 0 && (searchCtrl.value?.length ?? 0) > 1) {
            <mat-option disabled>{{ language.transform('no_data') }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ language.transform('cancel') }}</button>
      <button mat-flat-button
        [disabled]="!selectedStudent() || saving()"
        (click)="onSave()">
        @if (saving()) {
          <mat-spinner diameter="18" style="margin-inline-end: 6px;" />
        }
        {{ language.transform('save') }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddStudentToClassDialog {
  language      = inject(Language);
  matSnackBar   = inject(MatSnackBar);
  dialogRef     = inject(MatDialogRef<AddStudentToClassDialog>);
  data          = inject<AddStudentToClassDialogData>(MAT_DIALOG_DATA);
  classEndpoints   = inject(ClassEndpoints);
  studentEndpoints = inject(StudentEndpoints);

  searchCtrl      = new FormControl('');
  students        = signal<{ id: number; fullName: string }[]>([]);
  selectedStudent = signal<{ id: number; fullName: string } | null>(null);
  searching       = signal(false);
  saving          = signal(false);

  constructor() {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(val => {
      if (typeof val === 'string' && val.trim().length > 1) {
        this.searching.set(true);
        this.studentEndpoints.getStudentsSimple(val.trim(), 1, 20).subscribe({
          next: page => { this.students.set(page.content); this.searching.set(false); },
          error: ()  => this.searching.set(false),
        });
      } else {
        this.students.set([]);
      }
    });
  }

  displayFn(s: { id: number; fullName: string } | string | null): string {
    if (!s) return '';
    return typeof s === 'string' ? s : s.fullName;
  }

  onSelect(student: { id: number; fullName: string }) {
    this.selectedStudent.set(student);
  }

  onSave() {
    const student = this.selectedStudent();
    if (!student) return;

    this.saving.set(true);
    this.classEndpoints.addStudentToClass(this.data.classId, student.id).subscribe({
      next: () => {
        this.matSnackBar.open(
          this.language.transform('success'),
          this.language.transform('close'),
          successMatSnackbarConfig(this.language),
        );
        this.dialogRef.close({ reload: true });
      },
      error: err => {
        this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.saving.set(false);
      },
    });
  }

  onCancel() { this.dialogRef.close(); }
}
