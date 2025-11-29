import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SemesterViewModel } from './model/semester-view-model';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddSemesterDialog } from './dialog/add-semester-dialog/add-semester-dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { SemesterFilterViewModel } from './model/semester-filter-view-model';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { SemesterEndpoints } from '../../endpoints/semester-endpoints';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-semester-component',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule, MatInputModule,ReactiveFormsModule,
    ɵInternalFormsSharedModule,
    MatProgressBarModule 
],
  templateUrl: './semester.html',
  styleUrl: './semester.scss',
})
export class Semester {
  semesterViewModels = signal<SemesterViewModel[]>([]);
  headerTable:string[] = ['semester','createdAt','action'];
  form!: FormGroup;
  loading = signal<boolean>(false) ;

  filter = signal<SemesterFilterViewModel>( {
      pageSize:10,
      selectedPage:1,
      name: ''
    });

  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    public parmas:ParamsService,
    public semesterEndpoints:SemesterEndpoints,
    public fb: FormBuilder,
    public matSnackBar:MatSnackBar,
  ){
    this.filter.update(x=>{
      const param = parmas.loadFromUrl<SemesterFilterViewModel>(this.filter());

      x.pageSize = param.pageSize? param.pageSize: 10;
      x.selectedPage = param.selectedPage? param.selectedPage: 1;
      x.name = param.name

      return x;
    });
    effect(()=>{
      parmas.setToUrl(this.filter());
    })
    this.form = this.fb.group(
      {
        name: [this.filter().name??''],
      } 
    );
    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      this.filter.update(prev => ({ ...prev, name: value.name }));
      this.onLoading();
    })
    this.onLoading();
  }

  async onLoading(){
    const result = this.semesterEndpoints.get(
      this.filter().selectedPage,
      this.filter().pageSize,
      this.filter().name
    )
    this.loading.set(true);
    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.filter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.selectedPage = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        this.semesterViewModels.set(success.content)
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
      AddSemesterDialog, 
      {
        width: "80%"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      this.semesterViewModels.update(arr => [result.data, ...arr]);
    });
  }

  
    openUpdateDialog(semesterViewModel: SemesterViewModel){
      const dialogRef = this.dialog.open(
        AddSemesterDialog, 
        {
          width: "80%",
          data:{
            semester: semesterViewModel
          }
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.semesterViewModels.update(arr => 
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
          title:this.language.transform('delete_semester'),
          action: ()=>{
            const result = this.semesterEndpoints.delete(id)
            
            result.subscribe({
              next: success=>{
                this.semesterViewModels.update(x=> {
                  return x.filter(y=> y.id != success.id)
                })
                this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
                dialogRef.close();
              },
              error: error=>{
                this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              }
            })
          },
          width: "80%"
        }
      }
    );
    
  }

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.selectedPage = pageEvent.pageIndex + 1;  
          return x;
        });
    this.onLoading();
    // this.parmas.setToUrl(this.filter())
  }  
}
