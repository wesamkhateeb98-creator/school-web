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
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { AgeGroupModel } from '../../../endpoints/models/age-group/age-group-model';
import { AcademicYearModel } from '../../academic-year/model/academic-year-model';
import { debounceTime, map, of, startWith, switchMap, tap } from 'rxjs';
import { ClassEndpoints } from '../../../endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../../endpoints/age-group-endpoint';
import { AcademicYearEndpoints } from '../../../endpoints/academic-year-endpoints';
import { AsyncPipe } from '@angular/common';

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
  templateUrl: './add-class-dialog.html',
  styleUrl: './add-class-dialog.scss',
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
      ageGroupId: [classData?.ageGroupId || '', [Validators.required]],
      academicYearId: [classData?.academicYearId || '', [Validators.required]],
      section: [classData?.section || '', [Validators.required, Validators.min(3),Validators.max(30)]],
      ageGroupName: [classData?.ageGroupName || ''],
      academicYearName: [classData?.academicYear || '']
    });
  }

  setupAutocompletes() {
    // Age Group Autocomplete Logic
    this.ageGroups$ = this.form.get('ageGroupName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this.ageGroupEndpoint.get(typeof value === 'string' ? value : '', 1, 20)),
      map(response => response.content)
    );

    // Academic Year Autocomplete Logic
    this.academicYears$ = this.form.get('academicYearName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        return this.academicYearEndpoint.get(1, 20);
      }),
      map(response => response.content),
      tap(items => {
        // Auto-select first item on initialization
        if (!this.isUpdate() && items.length > 0 && !this.form.get('academicYearId')?.value) {
          const first = items[0];
          this.form.patchValue({
            academicYearId: first.id,
            academicYearName: first // Store the whole object to allow display math
          }, { emitEvent: false });
        }
      })
    );
  }

  displayAgeGroup(item: AgeGroupModel): string {
    return item?.name || '';
  }

  displayAcademicYear = (item: any): string => {
    if (!item) return "";
    
    // If it's the model object (from auto-select or dropdown)
    if (item && typeof item === 'object' && item.year) {
      const year = Number(item.year);
      return `${year}/${year + 1}`;
    }

    // If the user is currently typing a number, just show the number
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