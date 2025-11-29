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
    ɵInternalFormsSharedModule
],
  templateUrl: './semester.html',
  styleUrl: './semester.scss',
})
export class Semester {
  semesterViewModels = signal<SemesterViewModel[]>([]);
  headerTable:string[] = ['semester','createdAt','action'];
  form!: FormGroup;


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

  onLoading(){
    const data = this.semesterEndpoints.get(
      this.filter().selectedPage,
      this.filter().pageSize,
      this.filter().name
    )

    if(data != null){
      this.filter.update(x=>
        {
          x.pageSize = data.pageSize;
          x.selectedPage = data.pageNumber;  
          return x;
        });
        this.totalPages.set(data.countPages)
        this.semesterViewModels.set(data.content)
    }

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
            const idResponse = this.semesterEndpoints.delete(id)
            if(idResponse != null){
              dialogRef.close();
                this.semesterViewModels.update(x=>{
                  return x.filter(item => item.id !== id);
              })
            }
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
