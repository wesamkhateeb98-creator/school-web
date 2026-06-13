import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../../../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../../core/consts';
import { DayDropDown } from "../../../../../../shared/components/day-drop-down/day-drop-down";
import { SubjectAutoComplete } from "../../../../../../shared/components/subject-auto-complete/subject-auto-complete";
import { PeriodAutoComplete } from "../../../../../../shared/components/period-auto-complete/period-auto-complete";
import { TeacherAutoComplete } from "../../../../../../shared/components/teacher-auto-complete/teacher-auto-complete";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorTitleComponent } from "../../../../../../../shared/components/error-title-component/error-title-component";
import { StudentEndpoints } from '../../../../../../shared/endpoints/student-endpoint';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDivider } from "@angular/material/divider";
import { MatCardActions, MatCard, MatCardModule } from "@angular/material/card";
import { CommonModule, DatePipe } from '@angular/common';
import { StudentByIdModel } from '../../../../../../shared/endpoints/models/student/student-by-id-model';
import { MatSelectModule } from '@angular/material/select';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { ResponsiveScreen } from '../../../../../../../../core/services/responsive-screen';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FormatService } from '../../../../../../../../core/services/format-service';

@Component({
  selector: 'app-class-student-info-dialog',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinner
],
  templateUrl: './class-student-info-dialog.html',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class ClassStudentInfoDialog implements OnInit {
  
  // ======================================== INJECTION ========================================
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ClassStudentInfoDialog>);
  private data = inject(MAT_DIALOG_DATA);
  public language = inject(Language);
  public matSnackBar = inject(MatSnackBar);
  public studentEndpoints = inject(StudentEndpoints);
  public response = inject(ResponsiveScreen);
  public formatService = inject(FormatService);
  
  // ======================================== PREPARE DATA ========================================
  
  loading = signal<boolean>(true);
  form!: FormGroup;
  
  // ======================================== Input Data ========================================

  studentId:number = 0;
  
  studentModel!:StudentByIdModel

  ngOnInit() {
    this.studentId = this.data.studentId;
  
    this.studentEndpoints.getStudentById(this.studentId)
      .subscribe({
        next: x=>{
          this.studentModel = x
          this.loading.set(false);
        },
        error: error=>{
          this.matSnackBar.open(error.message || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      })
  }

  onNoClick() { this.dialogRef.close(); }
}