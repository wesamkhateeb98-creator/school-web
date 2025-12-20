import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TeacherViewModel } from './view-model/teacher-view-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TeacherFilterViewModel } from './view-model/teacher-filter-view-model';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherEndpoints } from '../../endpoints/teacher-endpoint';
import { debounceTime } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { AddTeacherDialog } from './add-teacher-dialog/add-teacher-dialog';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';

@Component({
  selector: 'app-teacher-page',
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
    MatAutocompleteModule,
    DatePipe
  ],
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.scss',
})
export class TeacherPage {
  teachers = signal<TeacherViewModel[]>([]);

  teacherFilter = signal<TeacherFilterViewModel>(
    {
      pageNumber:1,
      pageSize:10
    }
  );

  totalPages = signal<number>(1);

  loading = signal<boolean>(false);

  headerTable:string[] = [
    'name',
    'phonenumber',
    'createdAt',
    'action'
  ];

  form!: FormGroup;


  constructor(
    public language:Language,
    public dialog :MatDialog,
    public parmas:ParamsService,
    public matSnackBar:MatSnackBar,
    public teacherEndpoints:TeacherEndpoints,
    public fb: FormBuilder,
  ){
    this.setFilterFromUrl()
    this.initiateForm();
    this.loadStudentViewModel();
  }

  setFilterFromUrl(){
    this.teacherFilter.update(x=>{
        const param = this.parmas.loadGenericFromUrl();
        
        x.pageSize = param['pageSize']?  param['pageSize']: 10;
        x.pageNumber = param['pageNumber']? param['pageNumber']: 1;
        x.name = param['fullName']
        x.phonenumber =  param['phonenumber'];
        return x;
      });
    effect(()=>{
      this.parmas.setToUrl({
        'pageSize':this.teacherFilter().pageSize,
        'pageNumber':this.teacherFilter().pageNumber,
        'fullName':this.teacherFilter().name,
        'phonenumber':this.teacherFilter().phonenumber
      });
    })
  }

  initiateForm(){
    this.form = this.fb.group(
      {
        fullName: [this.teacherFilter().name??''],
        phonenumber: [this.teacherFilter().phonenumber??'']
      } 
    );

    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      this.teacherFilter.update(prev => 
        ({
          ...prev, 
          name: value.fullName?? '',
          phonenumber: value.phonenumber??''
        }));

      this.loadStudentViewModel();
    })

    this.loadStudentViewModel()
  }

  loadStudentViewModel(){
    
    this.loading.set(true);
    
    const result = this.teacherEndpoints.get(this.teacherFilter())

    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.teacherFilter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.pageNumber = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        this.teachers.set(
            success.content.map(x=> new TeacherViewModel(
            x.id,
            x.fullName,
            x.phoneNumber,
            new Date(),
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
      AddTeacherDialog, 
      {
        width: "80vw",
        maxWidth: "80vw"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      this.teachers.update(arr => [result.data, ...arr]);
    });
  }

  openUpdateDialog(teacher:TeacherViewModel){
    const dialogRef = this.dialog.open(
      AddTeacherDialog, 
      {
        width: "80vw",
        maxWidth: "80vw",
        data:{
          teacher: teacher
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teachers.update(arr => 
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
            this.teacherEndpoints.delete(id).subscribe({
            next:success=>{
              dialogRef.close();
              this.teachers.update(x=>{
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
    this.teacherFilter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
      this.loading();
      this.parmas.setToUrl(this.teacherFilter())
  }
}
