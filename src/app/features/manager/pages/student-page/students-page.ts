import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-student-page',
  imports: [
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './students-page.html',
  styleUrl: './students-page.scss',
})
export class StudentsPage {
  students = signal<StudentViewModel[]>([]);
  studentFilter = signal<StudentFilterViewModel>(
    {
      name:undefined,
      ageGroupId: undefined,
      phoneNumber: undefined,
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

  constructor(
    public language:Language,
    public dialog :MatDialog,
    public parmas:ParamsService,
    public matSnackBar:MatSnackBar,
    public studentEndpoints:StudentEndpoints
  ){
    this.loadStudentViewModel();
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
}
