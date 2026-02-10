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
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, take, takeWhile } from 'rxjs';
import { MatGridList, MatGridListModule, MatGridTile } from "@angular/material/grid-list";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddStudentDialog } from './components/add-student-dialog/add-student-dialog';
import { AccountCodeDialog } from '../../../auth/dialogs/account-code-dialog/account-code-dialog';
import { AgeGroupModel } from '../../shared/endpoints/models/age-group/age-group-model';
import { StudentEndpoints } from '../../shared/endpoints/student-endpoint';
import { AssignStudentDialog } from './components/assign-student-dialog/assign-student-dialog';
import { AgeGroupAutoComplete } from "../../shared/components/age-group-auto-complete/age-group-auto-complete";
import { ResponsiveScreen } from '../../../../core/services/responsive-screen';
import { AgeGroupViewModel } from '../age-group/model/age-group-view-model';
import { Router } from '@angular/router';
import { MatTooltip } from "@angular/material/tooltip";
import { StudentStatusService } from '../../../../core/enums/service/student-status-service';

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
    MatGridListModule,
    MatGridTile,
    MatAutocompleteModule,
    AgeGroupAutoComplete,
    MatTooltip
],
  templateUrl: './students-page.html',
})
export class StudentsPage {
  students = signal<StudentViewModel[]>([]);
  studentFilter = signal<StudentFilterViewModel>(
    {
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
    'studentStatus',
    'isExpelled',
    'isVisitParentRequired',
    'action'
  ];

  form!: FormGroup;


  constructor(
    public language:Language,
    public dialog :MatDialog,
    public parmas:ParamsService,
    public matSnackBar:MatSnackBar,
    public studentEndpoints:StudentEndpoints,
    public fb: FormBuilder,
    public responsive:ResponsiveScreen,
    public router: Router,
    public studentStatusService: StudentStatusService
  ){
    this.setFilterFromUrl()
    this.initiateForm();
  }

  
  setFilterFromUrl(){
    this.studentFilter.update(x=>{
        const param = this.parmas.loadGenericFromUrl();
        
        x.pageSize = param['pageSize']?  param['pageSize']: 10;
        x.pageNumber = param['pageNumber']? param['pageNumber']: 1;
        x.name = param['fullName']
        x.phonenumber =  param['phonenumber'];
        
        return x;
      });
  }

  initiateForm(){
    this.form = this.fb.group(
      {
        fullName: [this.studentFilter().name??''],
        phonenumber: [this.studentFilter().phonenumber??''],
      } 
    );

    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value=>{
        this.studentFilter.update(prev => 
          ({
            ...prev, 
            name: value.fullName?? '',
            phonenumber: value.phonenumber??'',
            ageGroup: value.ageGroup
          }));
        this.loadStudentViewModel();
    })

  }

  loadStudentViewModel(){
    this.loading.set(true);
    
    this.studentFilter.update(x=>({...x,ageGroup:this.form.value.ageGroup??undefined }))
  
    const result = this.studentEndpoints.get(this.studentFilter())

    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.studentFilter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.pageNumber = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        this.students.set(
            success.content.map(x=> new StudentViewModel(
            x.id,
            x.ageGroupId,
            x.ageGroupName,
            x.fullName,
            x.fatherName,
            x.motherName,
            x.address,
            x.birthday,
            x.phoneNumber,
            false,
            x.status,
            x.isExpelled,
            x.isVisitParentRequired
          )));
        this.loading.set(false);
        
      },
      error:(error)=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    })
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddStudentDialog, 
      {
        width: "80vw",
        maxWidth: "80vw"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      this.students.update(arr => [result.data, ...arr]);
    });
  }

  openUpdateDialog(student:StudentViewModel){
    const dialogRef = this.dialog.open(
      AddStudentDialog, 
      {
        width: "80vw",
        maxWidth: "80vw",
        data:{
          student: student
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.students.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        
      }
    });
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

  openAssignStudentDialog(viewModel:StudentViewModel){
    const dialogRef = this.dialog.open(
      AssignStudentDialog, 
      {
        data:{
          ageGroupId: viewModel.ageGroupId,
          accountId: viewModel.id
        },
        width: "80vw",
        maxWidth: "80vw"
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

      this.parmas.setToUrl({
        'pageSize':this.studentFilter().pageSize,
        'pageNumber':this.studentFilter().pageNumber,
        'fullName':this.studentFilter().name,
        'phonenumber':this.studentFilter().phonenumber,
        'ageGroupName':this.studentFilter().ageGroup?.name,
      });
    this.loadStudentViewModel();
  }  

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }

  // ########################## Navigation
  openAccountCodeDialog(id: number, phone: string) {
    this.dialog.open(AccountCodeDialog, {
      width: '50%',
      data: { id: id, phoneNumber: phone }
    });
  }

  openStudentNotesPage(studentId:number){
    this.router.navigate(["manager/student",studentId,"student-notes"])
  }

  openStudentPointsPage(studentId:number){
    this.router.navigate(["manager/student",studentId,"student-points"])
  }
  
  openStudentAttendancesPage(studentId:number){
    this.router.navigate(["manager/student",studentId,"student-attendance"])
  }
  
  openStudentParentVisitsPage(studentId:number){
    this.router.navigate(["manager/student",studentId,"student-parent-visits"])
  }
}
