import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { PeriodEndpoints } from '../../shared/endpoints/period-endpoint';
import { DayService } from '../../../../core/enums/service/day-service';
import { time24hTo12 } from '../../../../core/consts';
import { X } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-class-schedule-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './class-schedule.html'
})
export class ClassSchedulePage implements OnInit {

  // injection
  language = inject(Language);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  classEndpoints = inject(ClassEndpoints);
  periodEndpoints = inject(PeriodEndpoints);
  dayService = inject(DayService);

  // Input parameters
  classId :number;

  // table
  columns = signal<{key:string, label:string, sticky:boolean, stickyEnd:boolean}[]>([]);
  displayedColumns= signal<string[]>([]);
  dataSource: any[] = [];
  
  constructor(
  ){
    this.classId = +(this.route.snapshot.paramMap.get('id')??'0');
    effect(x=>{
      this.displayedColumns.set(this.columns().map(x=>x.key))
    });
  }
  
  ngOnInit(): void {
    this.addColumn('day','Day\\Period',true);
    this.onLoading();
  }

  addColumn(key: string, label: string, sticky:boolean = false, stickyEnd:boolean = false) {
    this.columns.update(cols => [
      ...cols,
      { key, label ,sticky:sticky,stickyEnd:stickyEnd}
    ]);
  }


  onLoading(){
    if(this.classId > 0)
    {
      this.periodEndpoints.get(1,10000).subscribe(x=>{
        x.content.forEach(x=> {
          this.addColumn(`key-${x.id}`, ` ${this.language.transform('class_period')}-${x.lessonNumber} ${time24hTo12(x.fromTime,this.language)} \n ${time24hTo12(x.toTime,this.language)}`);
        })
        this.columns.update(x=>{
          x[x.length-1].stickyEnd = true;
          return x;
        })
        console.log(this.columns())
      });
      
    }  
  }


  getDayName(day: number): string {
    const dayNames: any = {
      1: 'Saturday', 2: 'Sunday', 3: 'Monday', 
      4: 'Tuesday', 5: 'Wednesday', 6: 'Thursday', 7: 'Friday'
    };
    return dayNames[day];
  }

  // subjectViewModels = signal<SubjectViewModel[]>([]);
  // headerTable:string[] = ['subject','description','createdAt','action'];
  // ageGroupId!:number;

  // filter = signal<SubjectFilterViewModel>( {
  //     pageSize:10,
  //     pageNumber:1
  //   });

  // totalPages= signal<number>(10);

  

  //   openAcademicYearPage(){
  //     this.router.navigate(['manager/age-group']);
  //   }

  // onLoading(){
  //   this.subjectEndpoints.get(this.filter().pageNumber,this.filter().pageNumber,"")
  //     .subscribe({
  //       next:(success)=>{
  //         this.filter.update(x=>
  //         {
  //           x.pageSize = success.pageSize;
  //           x.pageNumber = success.pageNumber;  
  //           return x;
  //         });
  //         this.totalPages.set(success.countPages)
  //         this.subjectViewModels.set(success.content)
  //       },
  //       error:(error)=>{
  //         this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig(this.language));
  //       }
  //     })
  // }

  // openAddDialog(){
  //   const dialogRef = this.dialog.open(
  //     AddClassScheduleDialog, 
  //     {
  //       width: "80%",
  //       data:{     
  //         ageGroupId: this.ageGroupId
  //       }
  //     }
  //   );
    
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result)
  //       this.subjectViewModels.update(arr => [result.data, ...arr]);
  //   });
  // }

  
  // openUpdateDialog(subjectViewModel: SubjectViewModel){
  //   const dialogRef = this.dialog.open(
  //     AddClassScheduleDialog, 
  //     {
  //       width: "80%",
  //       data:{     
  //         ageGroupId: this.ageGroupId,
  //         subject: subjectViewModel
  //       }
  //     }
  //   );
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.subjectViewModels.update(arr => 
  //         {
  //           arr = arr.map(x => x.id === result.data.id ? result.data : x);
  //           return arr;
  //         }
  //       );
        
  //     }
  //   });
  // }

  // openDeleteDialog(id:number){
  //   const dialogRef = this.dialog.open(
  //     DeleteDialog, 
  //     {
  //       data:{
  //         title:this.language.transform('delete_subject'),
  //         action: ()=>{
  //           this.subjectEndpoints.delete(id)
  //             .subscribe({
  //               next:success=>{
  //                 dialogRef.close();
  //                 this.subjectViewModels.update(x=>{
  //                   return x.filter(item => item.id !== id);
  //                 })
  //                 this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
  //               },
  //               error: error=>{
  //                 this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
  //               }
  //             });
  //           }  
  //       },
  //       width: "80%"
  //     }
  //   );
    
  // }

  // changeInPage(pageEvent:PageEvent){
  //   this.filter.update(x=>
  //       {
  //         x.pageSize = pageEvent.pageSize;
  //         x.pageNumber = pageEvent.pageIndex + 1;  
  //         return x;
  //       });
  //     this.onLoading();
  //     this.parmas.setToUrl(this.filter())
  // }  
}
