import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { debounceTime, map, of, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClassEndpoints } from '../../../shared/endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';

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
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './add-class-dialog.html',
})
export class AddClassDialog implements OnInit {
  private fb                  = inject(FormBuilder);
  private classEndpoint       = inject(ClassEndpoints);
  private ageGroupEndpoint    = inject(AgeGroupEndpoints);
  private academicYearSvc     = inject(SelectedAcademicYearService);
  private dialogRef           = inject(MatDialogRef<AddClassDialog>);
  private data                = inject(MAT_DIALOG_DATA);

  public language    = inject(Language);
  public matSnackBar = inject(MatSnackBar);

  loading    = signal<boolean>(false);
  form!: FormGroup;
  key: string = crypto.randomUUID();

  ageGroups$ = of<AgeGroupModel[]>([]);

  ngOnInit() {
    this.initiateForm();
    this.setupAutocompletes();
  }

  initiateForm() {
    const classData = this.data?.classData;
    this.form = this.fb.group({
      ageGroupId:   [classData?.ageGroupId   || '', [Validators.required]],
      ageGroupName: [classData?.ageGroupName || ''],
      section:      [classData?.section      || '', [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  setupAutocompletes() {
    this.ageGroups$ = this.form.get('ageGroupName')!.valueChanges.pipe(
      startWith(this.data?.classData?.ageGroupName || ''),
      debounceTime(300),
      switchMap(value => {
        const search = typeof value === 'object' ? value.name : value;
        return this.ageGroupEndpoint.get(search, 1, 20);
      }),
      map(response => response.content),
      tap(items => {
        if (this.isUpdate() && items.length > 0 && !this.form.get('ageGroupId')?.value) {
          this.form.patchValue({ ageGroupId: items[0].id, ageGroupName: items[0] }, { emitEvent: false });
        }
      })
    );
  }

  displayAgeGroup(item: AgeGroupModel): string {
    return item?.name || '';
  }

  onAgeGroupSelected(event: any) {
    this.form.patchValue({ ageGroupId: event.option.value.id });
  }

  isUpdate(): boolean {
    return !!(this.data && this.data.classData);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const payload = {
      ageGroupId:     this.form.value.ageGroupId,
      academicYearId: this.academicYearSvc.selectedId()!,
      section:        this.form.value.section,
    };

    const obs = this.isUpdate()
      ? this.classEndpoint.update(this.data.classData.id, payload)
      : this.classEndpoint.add(this.key, payload);

    obs.subscribe({
      next: success => {
        this.matSnackBar.open(this.language.transform('success'), 'OK', successMatSnackbarConfig(this.language));
        this.dialogRef.close({ data: success });
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.Title || err.message, 'OK', errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  onNoClick() { this.dialogRef.close(); }
}
