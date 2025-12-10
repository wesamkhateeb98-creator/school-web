import { Component, effect, signal } from '@angular/core';
import { StudentViewModel } from './view-model/student-view-model';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Language } from '../../../../core/services/language';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StudentFilterViewModel } from './view-model/student-filter-view-model';
import { ParamsService } from '../../../../core/services/params-service';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { MatDialog } from '@angular/material/dialog';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentEndpoints } from '../../endpoints/student-endpoint';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime } from 'rxjs';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { AgeGroupEndpoints } from '../../endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../endpoints/models/age-group/age-group-model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-student-page',
  imports: [
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    MatAutocompleteModule
],
  templateUrl: './students-page.html',
  styleUrl: './students-page.scss',
})
export class StudentsPage {
  students = signal<StudentViewModel[]>([]);
  ageGroups = signal<AgeGroupModel[]>([]);
  studentFilter = signal<StudentFilterViewModel>(
    {
      name:"",
      ageGroupName: "",
      phonenumber: "",
      pageNumber:1,
      pageSize:10
    }
  );

  totalPages = signal<number>(1);

  loading = signal<boolean>(false);
  headerTable:string[] = [
    'name',
    'fatherName',
    'motherName',
    'ageGroup',
    'phonenumber',
    'address',
    'birthday',
    'action'
  ];

  form!: FormGroup;


  constructor(
    public language:Language,
    public dialog :MatDialog,
    public parmas:ParamsService,
    public matSnackBar:MatSnackBar,
    public studentEndpoints:StudentEndpoints,
    public ageGroupEndpoint:AgeGroupEndpoints,
    public fb: FormBuilder,
  ){
    this.loadAgeGroup();
    this.setFilterFromUrl()
    this.initiateForm();
    this.loadStudentViewModel();
  }

  loadAgeGroup(name?:string){
    this.ageGroupEndpoint.get(name??'',1,5)
      .subscribe(x=>{
        this.ageGroups.set(x.content) 
      });
  }

  setFilterFromUrl(){
    this.studentFilter.update(x=>{
        const param = this.parmas.loadFromUrl<StudentFilterViewModel>(this.studentFilter());

        if(param.ageGroupName?.length??0 > 0){
          this.ageGroupEndpoint.get(param.ageGroupName??'',1,1).subscribe(
            x=>{
              this.ageGroups.set(x.content);
              this.form.get('ageGroup')?.setValue(x.content[0]);
            }
          );
        }

        x.pageSize = param.pageSize? param.pageSize: 10;
        x.pageNumber = param.pageNumber? param.pageNumber: 1;
        x.name = param.name
        x.phonenumber =  param.phonenumber;
        x.ageGroupName = param.ageGroupName;
        return x;
      });
    effect(()=>{
      this.parmas.setToUrl(this.studentFilter());
    })
  }

  initiateForm(){
    this.form = this.fb.group(
      {
        name: [this.studentFilter().name??''],
        phonenumber: [this.studentFilter().phonenumber??''],
        ageGroup: [null],
      } 
    );
    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      
      this.studentFilter.update(prev => 
        ({ 
          ...prev, 
          name: value.name,
          phonenumber: value.phonenumber,
          ageGroupName: value.ageGroup.name
        }));

      this.loadStudentViewModel();
    })
    this.loadStudentViewModel()
  }

  loadStudentViewModel(){
    this.students.set([
      {
          id: 1,
          ageGroupId: 5,
          ageGroupName: "Grade 5",
          name: "John Doe",
          fatherName: "Michael",
          motherName: "Sarah",
          address: "123 Main St",
          birthday: new Date("2015-05-15T00:00:00.000Z"),
          phoneNumber: "555-1234",
          lock: false
      },
      {
          id: 2,
          ageGroupId: 5,
          ageGroupName: "Grade 5",
          name: "Jane Smith",
          fatherName: "Robert",
          motherName: "Emily",
          address: "456 Oak St",
          birthday: new Date("2015-06-20T00:00:00.000Z"),
          phoneNumber: "555-5678",
          lock: false
      },
      {
          id: 3,
          ageGroupId: 6,
          ageGroupName: "Grade 6",
          name: "John Williams", // Duplicate first name
          fatherName: "David",
          motherName: "Lisa",
          address: "789 Pine St",
          birthday: new Date("2014-04-10T00:00:00.000Z"),
          phoneNumber: "555-9012",
          lock: true
      }
    ]);
  }

  openUpdateDialog(student:StudentViewModel){

  }

  openDeleteDialog(id:number){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_age_group'),
          action: ()=>{
            this.studentEndpoints.delete(id).subscribe({
            next:success=>{
              dialogRef.close();
              this.students.update(x=>{
                return x.filter(item => item.id !== id);
              })
              this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));                        
            },
            error: error=>{
              this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            }
          });
            }  
        },
        width: "80%"
      }
    );
  }

  changeInPage(pageEvent:PageEvent){
    this.studentFilter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
      this.loading();
      this.parmas.setToUrl(this.studentFilter())
  }  

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }
}
