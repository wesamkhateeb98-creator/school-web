import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { MatGridList, MatGridTile, MatLine } from "@angular/material/grid-list";
import { Language } from '../../../../../../core/services/language';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AgeGroupEndpoints } from '../../../../shared/endpoints/age-group-endpoint';
import { maxYearValidator } from '../../../../../../core/validator/validator';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { StudentEndpoints } from '../../../../shared/endpoints/student-endpoint';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentViewModel } from '../../view-model/student-view-model';
import { AgeGroupModel } from '../../../../shared/endpoints/models/age-group/age-group-model';
import { AgeGroupAutoComplete } from "../../../../shared/components/age-group-auto-complete/age-group-auto-complete";
import { StudentStatusService } from '../../../../../../core/enums/service/student-status-service';
import { MatSelectModule } from '@angular/material/select';

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
    MatButtonModule,
    AgeGroupAutoComplete,
    MatSelectModule
],
  templateUrl: './add-student-dialog.html',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class AddStudentDialog{
  loading = signal<boolean>(false);

  form!: FormGroup;

  key:string = crypto.randomUUID();

  ageGroups = signal<AgeGroupModel[]>([]);

  minDate = new Date(1998, 0, 1);

  constructor(
    public language:Language,
    public fb: FormBuilder,
    public matSnackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AddStudentDialog>,
    public ageGroupEndpoint:AgeGroupEndpoints,
    public studentEndpoint:StudentEndpoints,
    public studentStatusService: StudentStatusService
  ){ 
    this.intiateForm();
  }

  async intiateForm(){
    const updateMode = this.isUpdate();

    await this.loadAgeGroup(
      updateMode? this.data.student.ageGroupName: '',
      ()=>{
        if(this.isUpdate()){
          this.form.get('ageGroup')?.setValue(this.ageGroups()[0]);
        }
      });

    this.form = this.fb.group({
      ageGroup: [null, [Validators.required]],
      fullName:  [updateMode? this.data.student.fullName:'', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      fatherName: [updateMode? this.data.student.fatherName:'', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      motherName: [updateMode? this.data.student.motherName:'', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address:    [updateMode? this.data.student.address:'', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      birthday:   [updateMode? this.data.student.birthday:'', [Validators.required, maxYearValidator(new Date().getFullYear())]],
      phoneNumber: [updateMode? this.data.student.phoneNumber:'', [Validators.required, Validators.pattern(/^\d{7,10}$/)]], 
      studentStatus: [0]
    });
  }

  async loadAgeGroup(name?:string ,callback?:()=>void){
    const result = this.ageGroupEndpoint.get(name??'',1,5);

    result.subscribe(x=>{
      this.ageGroups.set(x.content) 
      if(callback)
        callback();
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
      this.addStudent();    
    }
    
    this.loading.set(false);
  }

  addStudent(){
    const result = this.studentEndpoint.add(
      this.key,
      {
        fullName: this.form.value.fullName,
        fatherName: this.form.value.fatherName,
        motherName: this.form.value.motherName,
        phoneNumber: this.form.value.phoneNumber,
        address: this.form.value.address,
        ageGroup: this.form.value.ageGroup,
        birthday: this.form.value.birthday,
        status: this.form.value.studentStatus
      }
    )
    
    result.subscribe({
        next: (success) => {
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          const data = new StudentViewModel(
            success.id,
            this.form.value.ageGroup.id,
            this.form.value.ageGroup.name,
            this.form.value.fullName,
            this.form.value.fatherName,
            this.form.value.motherName,
            this.form.value.address,
            this.form.value.birthday,
            this.form.value.phoneNumber,
            false,
            this.form.value.studentStatus,
            false,
            false
          );
          this.dialogRef.close({
            data
          });
        },
        error: (error) => {
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        }
      });
  }


  updateAcademicYear(){
    const result = this.studentEndpoint.update(
      this.data.student.id,
      {
        fullName: this.form.value.fullName,
        fatherName: this.form.value.fatherName,
        motherName: this.form.value.motherName,
        phoneNumber: this.form.value.phoneNumber,
        address: this.form.value.address,
        ageGroup: this.form.value.ageGroup,
        birthday: this.form.value.birthday,
        status: this.form.value.studentStatus
      }
    )

    result.subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = new StudentViewModel(
            success.id,
            this.form.value.ageGroup.id,
            this.form.value.ageGroup.name,
            this.form.value.fullName,
            this.form.value.fatherName,
            this.form.value.motherName,
            this.form.value.address,
            this.form.value.birthday,
            this.form.value.phoneNumber,
            false,
            this.form.value.studentStatus,
            false,
            false
          );
        this.dialogRef.close({
          data
        });  
      },
      error: error=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }

  data = inject(MAT_DIALOG_DATA);

  isUpdate () : boolean{
    return this.data && this.data.student && this.data.student != null ;
  }

  ageGroupModel(){
    if(this.isUpdate())
      return {
        id: this.data.id,
        name: this.data.name,
      } as AgeGroupModel
    return null;
  }

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }
}

