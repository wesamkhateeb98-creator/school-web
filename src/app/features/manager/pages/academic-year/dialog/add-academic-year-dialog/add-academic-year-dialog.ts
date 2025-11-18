import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Language } from '../../../../../../core/services/language';
import { MatGridListModule } from '@angular/material/grid-list';
import { ManagerStateService } from '../../../../services/manager-state-service';
import { ResponsiveScreen } from '../../../../../../core/services/responsive-screen';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-add-academic-year-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './add-academic-year-dialog.html',
  styleUrl: './add-academic-year-dialog.scss',
})
export class AddAcademicYearDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;

  constructor(
    public dialogRef:MatDialogRef<AddAcademicYearDialog>,
    public language:Language,
    public managerState:ManagerStateService,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder
  ){
    this.form = this.fb.group({
      academicYear:[
        '',
        [Validators.required,Validators.min(2024),]
      ]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async addAcademicYear(){
    if(!this.form.valid)
      return;
    console.log("123");
    this.loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.loading.set(false);
    console.log("123");

    this.dialogRef.close();
  }
}
