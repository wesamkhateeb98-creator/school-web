import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Language } from '../../../../../../core/services/language';
import { MatGridListModule } from '@angular/material/grid-list';
import { ResponsiveScreen } from '../../../../../../core/services/responsive-screen';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpHelper } from '../../../../../../core/services/http-helper';
import { MutateResponse } from '../../../../view-model/mutate-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { AcademicYearViewModel } from '../../model/academic-year-view-model';
import { AcademicYearModel } from '../../model/academic-year-model';

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
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './add-academic-year-dialog.html',
  styleUrl: './add-academic-year-dialog.scss',
})
export class AddAcademicYearDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;
  key:string = crypto.randomUUID();

  data = inject(MAT_DIALOG_DATA);


  constructor(
    public dialogRef:MatDialogRef<AddAcademicYearDialog>,
    public language:Language,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){
this.form = this.fb.group({
      academicYear:[
        this.isUpdate()?this.item().year : "2025",
        [Validators.required,Validators.min(2024),]
      ]
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  submit(){
    if(!this.form.valid)
      return;
    
    this.loading.set(true);

    if(this.isUpdate()){
      this.updateAcademicYear();
    }else{
      this.addAcademicYear();    
    }
    
    this.loading.set(false);
  }

  addAcademicYear(){
    this.http.post<MutateResponse>("AcademicYear",{
      key:this.key,
      year:this.form.get('academicYear')?.value
    }).subscribe(
      success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        const data = new AcademicYearViewModel(success.id,this.form.get('academicYear')?.value,new Date());
        // this.data.ChangeAction(data);
        this.dialogRef.close({
          data
        });
      },
      error=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig);
      }
    );
  }

  updateAcademicYear(){
    this.http.put<MutateResponse>("AcademicYear/" + this.item().id,{
      year:this.form.get('academicYear')?.value
    }).subscribe(
      success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        const data = new AcademicYearViewModel(success.id,this.form.get('academicYear')?.value,new Date());
        this.dialogRef.close({
          data
        });
      },
      error=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig);
      }
    );
  }

  isUpdate () : boolean{
    return this.data && this.data.item && this.data.item != null ;
  }

  item() :AcademicYearModel{
    return this.data.item;
  } 

}