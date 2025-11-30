import { Component, signal } from '@angular/core';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { AddAcademicYearDialog } from '../add-academic-year-dialog/add-academic-year-dialog';
import { Language } from '../../../../../../core/services/language';
import { SemesterForAcademicYearViewModel } from '../../model/semester-for-academic-year-view-model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SemesterForAcademicYearFilter } from '../../model/semester-for-academic-year-filter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../../../core/services/params-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startDateMustLessEndDateValidator } from '../../../../../../core/validator/validator';
import { MatInputModule } from '@angular/material/input';
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { MatDatepickerInput, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";


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
  loading = signal<boolean>(false);

  headerTable:string[] = ['startDate','endDate','semesterName','createdAt','Action'];

  semesterForm!: FormGroup;

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
    public fb:FormBuilder
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
  }

  addSemester(){
    if(!this.semesterForm.valid)
      return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 20000);
  }

  onLoading(){

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
  
  openDeleteDialog(id:number){
    
  }

  change($event:Event){
    console.log($event)
  }
}
