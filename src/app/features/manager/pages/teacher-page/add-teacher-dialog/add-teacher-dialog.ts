import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatGridList, MatGridTile, MatLine } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { TeacherViewModel } from '../view-model/teacher-view-model';
import { TeacherEndpoints } from '../../../shared/endpoints/teacher-endpoint';

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
    MatButtonModule
],
  templateUrl: './add-teacher-dialog.html',
  styleUrl: './add-teacher-dialog.scss',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class AddTeacherDialog implements OnInit {
  private fb = inject(FormBuilder);
  private teacherEndpoint = inject(TeacherEndpoints);
  private dialogRef = inject(MatDialogRef<AddTeacherDialog>);
  private data = inject(MAT_DIALOG_DATA);
  public language = inject(Language);
  public matSnackBar = inject(MatSnackBar);

  loading = signal<boolean>(false);
  form!: FormGroup;
  key: string = crypto.randomUUID();

  ngOnInit() {
    this.initiateForm();
  }

  initiateForm() {
    const teacher = this.data?.teacher;
    this.form = this.fb.group({
      fullName: [teacher?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phoneNumber: [teacher?.phoneNumber || '', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
    });
  }

  isUpdate(): boolean {
    return !!(this.data && this.data.teacher);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const obs = this.isUpdate() 
      ? this.teacherEndpoint.update(this.data.teacher.id, this.form.value)
      : this.teacherEndpoint.add(this.key, this.form.value);

    obs.subscribe({
      next: (success) => {
        this.matSnackBar.open(
          this.language.transform("success"), 
          this.language.transform('close'), 
          successMatSnackbarConfig(this.language)
        );
        
        // Map response back to ViewModel
        const resultData = new TeacherViewModel(
          success.id,
          this.form.value.fullName,
          this.form.value.phoneNumber,
          new Date(),
          false 
        );

        this.dialogRef.close({ data: resultData });
        this.loading.set(false);
      },
      error: (err) => {
        this.matSnackBar.open(
          err.error?.Title || err.message, 
          this.language.transform('close'), 
          errorMatSnackbarConfig(this.language)
        );
        this.loading.set(false);
      }
    });
  }
}