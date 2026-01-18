import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { ClassEndpoints } from '../../../../shared/endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../../../shared/endpoints/age-group-endpoint';
import { AcademicYearEndpoints } from '../../../../shared/endpoints/academic-year-endpoints';
import { Language } from '../../../../../../core/services/language';
import { AgeGroupModel } from '../../../../shared/endpoints/models/age-group/age-group-model';
import { AcademicYearModel } from '../../../academic-year/model/academic-year-model';
import { debounceTime, map, of, startWith, switchMap, tap } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';

@Component({
  selector: 'app-add-student-dialog',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatDialogContent,
    MatGridList,
    MatDialogActions,
    MatGridTile,
    MatProgressBar,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    AsyncPipe
],
  templateUrl: './update-class-schedule-dialog.html',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class AddClassDialog implements OnInit {
  private fb = inject(FormBuilder);
  private classEndpoint = inject(ClassEndpoints);
  private ageGroupEndpoint = inject(AgeGroupEndpoints);
  private academicYearEndpoint = inject(AcademicYearEndpoints);
  private dialogRef = inject(MatDialogRef<AddClassDialog>);
  private data = inject(MAT_DIALOG_DATA);
  
  public language = inject(Language);
  public matSnackBar = inject(MatSnackBar);

  loading = signal<boolean>(false);
  form!: FormGroup;
  key: string = crypto.randomUUID();

  ageGroups$ = of<AgeGroupModel[]>([]);
  academicYears$ = of<AcademicYearModel[]>([]);

  ngOnInit() {
    this.initiateForm();
    this.setupAutocompletes();
  }

  initiateForm() {
    const classData = this.data?.classData;

    this.form = this.fb.group({
      academicYearId: [classData?.academicYearId || '', [Validators.required]],
      academicYear: [classData?.academicYear || ''],
      section: [classData?.section || '', [Validators.required, Validators.min(1),Validators.max(100)]],
      ageGroupId: [classData?.ageGroupId || '', [Validators.required]],
      ageGroupName: [classData?.ageGroupName || ''],
    });
  }
  setupAutocompletes() {
    // Age Group Logic
    this.ageGroups$ = this.form.get('ageGroupName')!.valueChanges.pipe(
      startWith(this.data?.classData?.ageGroupName || ''), // Start with existing name if updating
      debounceTime(300),
      switchMap(value => {
        // If value is an object (selected from autocomplete), use its name, otherwise use string
        const search = typeof value === 'object' ? value.name : value;
        return this.ageGroupEndpoint.get(search, 1, 20);
      }),
      map(response => response.content),
      tap(items => {
        // Auto-select first item if we are in "Update" mode and form is currently empty
        if (this.isUpdate() && items.length > 0 && !this.form.get('ageGroupId')?.value) {
          this.patchAgeGroup(items[0]);
        }
      })
    );

    // Academic Year Logic
    this.academicYears$ = this.form.get('academicYear')!.valueChanges.pipe(
      startWith(this.data?.classData?.academicYear || ''),
      debounceTime(300),
      switchMap(value => {
        const search = typeof value === 'object' ? value.year : value;
        return this.academicYearEndpoint.get(1, 20, search);
      }),
      map(response => response.content),
      tap(items => {
        if (this.isUpdate() && items.length > 0 && !this.form.get('academicYearId')?.value) {
          this.patchAcademicYear(items[0]);
        }
      })
    );
  }

  private patchAgeGroup(item: AgeGroupModel) {
    this.form.patchValue({
      ageGroupId: item.id,
      ageGroupName: item 
    }, { emitEvent: false });
  }

  private patchAcademicYear(item: AcademicYearModel) {
    this.form.patchValue({
      academicYearId: item.id,
      academicYear: item 
    }, { emitEvent: false });
  }

  displayAgeGroup(item: AgeGroupModel): string {
    return item?.name || '';
  }

  displayAcademicYear = (item: any): string => {
    if (!item) return "";
    
    if (item && typeof item === 'object' && item.year) {
      const year = Number(item.year);
      return `${year}/${year + 1}`;
    }

    return item.toString();
  }

  onAgeGroupSelected(event: any) {
    this.form.patchValue({ ageGroupId: event.option.value.id });
  }

  onAcademicYearSelected(event: any) {
    this.form.patchValue({ academicYearId: event.option.value.id });
  }

  isUpdate(): boolean {
    return !!(this.data && this.data.classData);
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const payload = {
      ageGroupId: this.form.value.ageGroupId,
      academicYearId: this.form.value.academicYearId,
      section: this.form.value.section
    };

    const obs = this.isUpdate() 
      ? this.classEndpoint.update(this.data.classData.id, payload)
      : this.classEndpoint.add(this.key, payload);

    obs.subscribe({
      next: (success) => {
        this.matSnackBar.open(this.language.transform("success"), "OK", successMatSnackbarConfig(this.language));
        this.dialogRef.close({ data: success });
        this.loading.set(false);
      },
      error: (err) => {
        this.matSnackBar.open(err.error?.Title || err.message, "OK", errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  onNoClick() { this.dialogRef.close(); }
}