import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { Language } from '../../../../../../core/services/language';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocomplete, MatAutocompleteModule } from "@angular/material/autocomplete";
import { AgeGroupModel } from '../../../../endpoints/models/age-group/age-group-model';
import { AgeGroupEndpoints } from '../../../../endpoints/age-group-endpoint';
import { maxYearValidator } from '../../../../../../core/validator/validator';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-student-dialog',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatDialogContent,
    ErrorTitleComponent,
    MatGridList,
    MatDialogActions,
    MatGridTile,
    MatProgressBar,
    MatAutocompleteModule,
    MatDatepickerInput,
    MatDatepickerModule,
    MatButtonModule
],
  templateUrl: './add-student-dialog.html',
  styleUrl: './add-student-dialog.scss',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class AddStudentDialog{
  loading = signal<boolean>(false);


  form!: FormGroup;
  key:string = crypto.randomUUID();

  ageGroups = signal<AgeGroupModel[]>([]);

  constructor(
    public language:Language,
    public fb: FormBuilder,
    public matSnackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AddStudentDialog>,
    public ageGroupEndpoint:AgeGroupEndpoints,
  ){ 
    this.form = this.fb.group({
      ageGroup: [null, [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      fatherName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      motherName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      birthday: ['', [Validators.required, maxYearValidator(new Date().getFullYear())]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],  // رقم هاتف أرقام فقط
    });
    this.loadAgeGroup();
  }

  loadAgeGroup(name?:string){
    this.ageGroupEndpoint.get(name??'',1,5)
      .subscribe(x=>{
        this.ageGroups.set(x.content) 
      });
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(){}

  data = inject(MAT_DIALOG_DATA);

  isUpdate () : boolean{
    return this.data && this.data.student && this.data.student != null ;
  }

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }
}

