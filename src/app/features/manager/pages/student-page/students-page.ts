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
import { AddStudentDialog } from './components/add-student-dialog/add-student-dialog';

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
        const param = this.parmas.loadGenericFromUrl();
        if(param['ageGroupName']?.length??0 > 0){
          this.ageGroupEndpoint.get(param['ageGroupName']??'',1,1).subscribe(
            s=>{
              this.ageGroups.set(s.content);
              this.form.get('ageGroup')?.setValue(s.content[0]);
              x.ageGroup = s.content[0];
            }
          );
        }

        x.pageSize = param['pageSize']?  param['pageSize']: 10;
        x.pageNumber = param['pageNumber']? param['pageNumber']: 1;
        x.name = param['fullName']
        x.phonenumber =  param['phonenumber'];
        
        return x;
      });
    effect(()=>{
      this.parmas.setToUrl({
        'pageSize':this.studentFilter().pageSize,
        'pageNumber':this.studentFilter().pageNumber,
        'fullName':this.studentFilter().name,
        'phonenumber':this.studentFilter().phonenumber,
        'ageGroupName':this.studentFilter().ageGroup?.name,
      });
    })
  }

  initiateForm(){
    this.form = this.fb.group(
      {
        fullName: [this.studentFilter().name??''],
        phonenumber: [this.studentFilter().phonenumber??''],
        ageGroup: [null],
      } 
    );

    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      this.studentFilter.update(prev => 
        ({
          ...prev, 
          name: value.fullName?? '',
          phonenumber: value.phonenumber??'',
          ageGroup: value.ageGroup
        }));

      this.loadStudentViewModel();
    })

    this.form.get('ageGroup')?.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      if(value.length > 0) 
        this.loadAgeGroup(value);
    })

    this.loadStudentViewModel()
  }

  loadStudentViewModel(){
    
    this.loading.set(true);
    
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
            false
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
