import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AgeGroupViewModel } from './model/age-group-view-model';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAgeGroupDialog } from './dialog/add-age-group-dialog/add-age-group-dialog';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { Page } from '../../../shared/model/page';
import { AgeGroupFilterViewModel } from './model/age-group-filter-view-model';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { MutateResponse } from '../../../shared/model/mutate-response';

@Component({
  selector: 'app-semester-component',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './age-group.html',
  styleUrl: './age-group.scss',
})
export class AgeGroup {
  ageGroupViewModels = signal<AgeGroupViewModel[]>([]);
  headerTable:string[] = ['semester','createdAt','action'];

  filter = signal<AgeGroupFilterViewModel>( {
      pageSize:10,
      selectedPage:1
    });

  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    route: ActivatedRoute,
    public router:Router,
    public httpHelper:HttpHelper,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService
  ){
    this.filter.update(x=>{
      const param = parmas.loadFromUrl<AgeGroupFilterViewModel>();

      x.pageSize = param.pageSize? param.pageSize: 10;
      x.selectedPage = param.selectedPage? param.selectedPage: 1
      
      parmas.setToUrl(x);

      return x;
    });
    this.onLoading();
  }

  onLoading(){
    
    this.httpHelper.get<Page<AgeGroupViewModel>>('age-group',{
      PageNumber:this.filter().selectedPage,
      PageSize: this.filter().pageSize,
    }).subscribe({
      next:(success)=>{
        this.filter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.selectedPage = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        this.ageGroupViewModels.set(success.content)
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), successMatSnackbarConfig(this.language));
      }
    })
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddAgeGroupDialog, 
      {
        width: "80%",
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      this.ageGroupViewModels.update(arr => [result.data, ...arr]);
    });
  }

  
    openUpdateDialog(ageGroupViewModel: AgeGroupViewModel){
      const dialogRef = this.dialog.open(
        AddAgeGroupDialog, 
        {
          width: "80%",
          data:{     
            ageGroup: ageGroupViewModel
          }
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.ageGroupViewModels.update(arr => 
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
            this.httpHelper.delete<MutateResponse>("age-group/"+id).subscribe({
            next:success=>{
              dialogRef.close();
              this.ageGroupViewModels.update(x=>{
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
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.selectedPage = pageEvent.pageIndex + 1;  
          return x;
        });
      this.onLoading();
      this.parmas.setToUrl(this.filter())
  }  

  openSubjectPage(ageGroup:AgeGroupViewModel){
    
    this.router.navigate(['manager/age-group',ageGroup.id,'subject']);
  }
}
