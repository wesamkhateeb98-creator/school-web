import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAcademicYearDialog } from '../add-academic-year-dialog/add-academic-year-dialog';
import { Language } from '../../../../../../core/services/language';
import { SemesterForAcademicYearViewModel } from '../../model/semester-for-academic-year-view-model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SemesterForAcademicYearFilter } from '../../model/semester-for-academic-year-filter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../../../core/services/params-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startDateMustLessEndDateValidator } from '../../../../../../core/validator/validator';
import { MatInputModule } from '@angular/material/input';
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { MatDatepickerInput, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { AcademicYearEndpoints } from '../../../../endpoints/academic-year-endpoints';
import { errorMatSnackbarConfig, StringToDate, successMatSnackbarConfig } from '../../../../../../core/consts';
import { debounceTime, distinctUntilChanged, filter, Observable, switchMap } from 'rxjs';
import { SemesterEndpoints } from '../../../../endpoints/semester-endpoints';
import { SemesterViewModel } from '../../../semester/model/semester-view-model';


@Component({
  selector: 'app-assign-semester-to-academic-year',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    ErrorTitleComponent,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDialogContent,
    MatGridList,
    MatGridTile
],
  providers:[
    provideNativeDateAdapter()
  ],
  templateUrl: './assign-semester-to-academic-year.html',
  styleUrl: './assign-semester-to-academic-year.scss',
})
export class AssignSemesterToAcademicYear {
  semesterForAcademicYear = signal<SemesterForAcademicYearViewModel[]>([]);
  semesterViewModels = signal<SemesterViewModel[]>([]);
  loading = signal<boolean>(false);
  headerTable:string[] = ['startDate','endDate','semesterName','createdAt','Action'];
  semesterForm!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  key:string = crypto.randomUUID();
  semesterForAcademicYearId = signal<number|null>(null);

  filter = signal<SemesterForAcademicYearFilter>( {
      pageSize:10,
      selectedPage:1
    });
  totalPages= signal<number>(10);


  constructor(
    public dialogRef:MatDialogRef<AddAcademicYearDialog>,
    public language:Language,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService,
    public fb:FormBuilder,
    public academicYearEndpoints:AcademicYearEndpoints,
    public semesterEndpoints:SemesterEndpoints
  ){
    this.semesterForm = this.fb.group(
      {
        name: [ '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        startDate: [ '', [Validators.required]],
        endDate: [ '', [Validators.required]],
      },
      {
        validators: [startDateMustLessEndDateValidator]
      }
    );
    this.semesterForm.get('name')!.valueChanges
      .pipe(
        debounceTime(500),          
        distinctUntilChanged(),     
        filter(value => value && value.length >= 1), 
        switchMap(value => semesterEndpoints.get(1,5,value))
      )
      .subscribe(results => {
        this.semesterViewModels.set(results.content);  
      });

    semesterEndpoints.get(1,5,'').subscribe({
      next: results => {
        this.semesterViewModels.set(results.content);  
      }
    })
    this.onLoading();
  }

  displayFn = (option?: SemesterViewModel): string =>  {
    console.log(option);
    return option ? option.name : '';
  }

  onLoading(){
    const result = this.academicYearEndpoints.getSemester(
      this.data.academicYearId,
      this.filter().selectedPage,
      this.filter().pageSize
    );
    result.subscribe({
      next: success=>{
        this.filter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.selectedPage = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        
        this.semesterForAcademicYear.set(
          success.content.map(x=>({
              id: x.id,
              startDate: StringToDate(x.startDate),
              endDate: StringToDate(x.endDate),
              semesterId: x.semesterId,
              semesterName: x.semesterName,
              createdAt: new Date(x.createdAt)
            } as SemesterForAcademicYearViewModel) ))

        this.loading.set(false);
      },
      error: error =>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    })
  }

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.selectedPage = pageEvent.pageIndex + 1;  
          return x;
        });
      this.onLoading();
      this.parmas.setToUrl(this.filter())
  }  
  
  setUpdateMode(semesterForAcademicYear:SemesterForAcademicYearViewModel){
    this.semesterForAcademicYearId.set(semesterForAcademicYear.id);
    this.semesterForm.patchValue({
      name: {
        id: semesterForAcademicYear.semesterId,
        name: semesterForAcademicYear.semesterName,
      },
      startDate: new Date(semesterForAcademicYear.startDate),
      endDate: new Date(semesterForAcademicYear.endDate)
    });
  }

  submit(){
    if(!this.semesterForm.valid)
      return;
    if(this.semesterForAcademicYearId())
      this.updateSemester();
    else  
      this.addSemester();
  }

  updateSemester(){
    if(!this.semesterForm.valid)
      return;
    
    this.academicYearEndpoints.updateSemester(
      this.data.academicYearId,
      this.semesterForAcademicYearId()??0,
      this.semesterForm.value.name.id,
      this.semesterForm.value.startDate,
      this.semesterForm.value.endDate
    ).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.semesterForAcademicYear.update(x=>
          x.map(x=>{
            if(this.semesterForAcademicYearId() != x.id) return x;

            x.semesterId = this.semesterForm.value.name.id;
            x.semesterName = this.semesterForm.value.name.id;
            x.startDate = this.semesterForm.value.startDate;
            x.endDate = this.semesterForm.value.endDate;
            
            return x;
          })
        );
        this.loading.set(false); 
        this.semesterForAcademicYearId.set(null);
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false); 
      }
    })
    
  }
  
  addSemester(){
    this.loading.set(true);
    
    this.academicYearEndpoints.addSemester(
      this.key,
      this.data.academicYearId,
      this.semesterForm.value.name.id,
      this.semesterForm.value.startDate,
      this.semesterForm.value.endDate
    ).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data:SemesterForAcademicYearViewModel = {
          id: success.id,
          semesterId: this.semesterForm.value.name.id,
          semesterName: this.semesterForm.value.name.semesterName,
          startDate: this.semesterForm.value.startDate,
          endDate:this.semesterForm.value.endDate,
          createdAt: new Date()
        };
        this.semesterForAcademicYear.update(x=>[data,...x]);
        this.loading.set(false); 
        this.key = crypto.randomUUID();
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false); 
      }
    })
  }

  deleteSemester(id:number){
    this.loading.set(true);
    
    this.academicYearEndpoints.deleteSemester(
      this.data.academicYearId,
      id
    ).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.semesterForAcademicYear.update(x=>x.filter(x=>x.id != id));
        
        this.loading.set(false); 
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false); 
      }
    })
  }
}
