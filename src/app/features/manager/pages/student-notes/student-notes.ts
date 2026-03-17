import { DatePipe, formatDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { errorMatSnackbarConfig, successMatSnackbarConfig, time24hTo12 } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { MatProgressBar } from "@angular/material/progress-bar";
import { StudentNoteEndpoints } from '../../shared/endpoints/student-note-endpoint';
import { NoteItem, NotesStatistics, StudentNotesResponse } from '../../shared/endpoints/models/student-note/student-notes-response';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentNoteTypeService } from '../../../../core/enums/service/student-note-type-service';
import { StudentNoteFilterTypeService } from '../../../../core/enums/service/student-note-filter-type-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericDialog } from '../../../shared/components/dialogs/generic-dialog/generic-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatOption } from "@angular/material/select";
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { StudentNotesDialog } from './dialog/student-notes-dialog/student-notes-dialog';
import { AcademicYearSemesterAutoComplete } from '../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';
import { FormatService } from '../../../../core/services/format-service';

@Component({
  selector: 'app-semester-component',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatSelect,
    MatOption,
    AcademicYearSemesterAutoComplete
],
  templateUrl: './student-notes.html',
})

export class StudentNotesPage implements OnInit{
  // ############# injections #############
  language = inject(Language);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  studentNotesEndpoints = inject(StudentNoteEndpoints)
  fb = inject(FormBuilder);
  studentNoteType = inject(StudentNoteTypeService);
  studentNoteFilterType = inject(StudentNoteFilterTypeService);
  formatService = inject(FormatService);

  // ############# data #############
  filter = signal<{pageSize:number, pageNumber:number}>({
    pageSize: +(this.activatedRoute.snapshot.paramMap.get('pageSize') ?? 10),
    pageNumber: +(this.activatedRoute.snapshot.paramMap.get('pageNumber') ?? 1)
  });
  
  studentNotesStatistics = signal<NotesStatistics>({
    academicCount:0,
    behavioralCount:0
  });
  
  studentNotes = signal<NoteItem[]>([]);
  
  headerTable:string[] = ['type','description','recordedAt','isReleased','releasedAt','isSolved','solvedAt','actions'];
  
  studentId!:number;
  
  classId!:number;
  
  loading= signal<boolean>(true);
  
  totalPages= signal<number>(0);

  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({
      'type':[this.parmas.loadGenericFromUrl()['type']??0],
      'semester':[null],
      'semesterId':[null],
      "semesterLoadFirst":[true]
    });
    this.studentId = +(this.activatedRoute.snapshot.paramMap.get('id')??'0');
    this.classId = +(this.activatedRoute.snapshot.paramMap.get('classId')??'0');
    this.filter.set({
      pageSize: +(this.parmas.loadGenericFromUrl()['pageSize'] ?? this.filter().pageSize),
      pageNumber: +(this.parmas.loadGenericFromUrl()['pageNumber'] ?? this.filter().pageNumber)
    });
  }

  ngOnInit(): void {
    this.form.get('type')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe(x=>{
        this.onLoading()
      });

    this.form.get('semesterId')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe(x=>{
        this.onLoading()
      });
  }

  onLoading(){
    if(!this.form.value.semesterId)
      return;
    
    this.loading.set(true);
    this.studentNotesEndpoints.get(
      this.studentId,
      this.form.value.semesterId,
      this.form.value.type,
      this.filter().pageNumber,
      this.filter().pageSize)
        .subscribe({
          next:(success)=>{
            if(success.statistics)
              this.studentNotesStatistics.set(success.statistics);
            this.studentNotes.set(success.notes.content);
            this.filter.set({
              pageSize: success.notes.pageSize,
              pageNumber: success.notes.pageNumber
            });

            this.totalPages.set(success.notes.countPages) 

            this.setFilterToUrl();

            this.loading.set(false);
          },
          error:(error)=>{
            this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            this.loading.set(false);
          }
        })
  }

  // ############# dialogs #############

  openAddDialog(){
    const dialogRef = this.dialog.open(
      StudentNotesDialog, 
      {
        width: "80%",
        data:{
          studentId: this.studentId
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.studentNotes.update(arr => [...arr, result.data]);
        this.studentNotesStatistics.update(x=>{
            if(result.data.type === 1){
              return {...x, behavioralCount: x.behavioralCount + 1}
            }else{
              return {...x, academicCount: x.academicCount + 1}
            }
          })
    });
  }

  
  openUpdateDialog(studentNote: NoteItem){
    const dialogRef = this.dialog.open(
      StudentNotesDialog, 
      {
        width: "80%",
        data:{     
          studentId: this.studentId,
          studentNote: studentNote,
          semester: this.form.get('semester')?.value
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentNotes.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        this.studentNotesStatistics.update(x=>{
          if(result.data.type !== studentNote.type){
            if(studentNote.type === 1){
              return {...x, behavioralCount: x.behavioralCount - 1 , academicCount: x.academicCount + 1}
            }else{
              return {...x, academicCount: x.academicCount - 1, behavioralCount: x.behavioralCount + 1}
            }
          }else{
            return x;
          }
        })
        
      }
    });
  }

  openDeleteDialog(note:NoteItem){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_period'),
          action: ()=>{
            this.studentNotesEndpoints.delete(note.id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.studentNotes.update(x=> {
                    return x.filter(y=> y.id != success.id)
                  })
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));

                  this.studentNotesStatistics.update(x=>{
                    if(note.type === 1){
                      return {...x, behavioralCount: x.behavioralCount - 1}
                    }else{
                      return {...x, academicCount: x.academicCount - 1}
                    }
                  })

                },
                error: error=>{
                  this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
                }
              });
            }  
        },
        width: "80%"
      }
    );
    
  }

  openReleaseToParentDialog(id:number){
    const dialogRef = this.dialog.open(
      GenericDialog, 
      {
        data:{
          title: this.language.transform('release_to_parent'),
          message: this.language.transform('do_you_want_release_to_parent_question'),
          actionTitle: this.language.transform('release_to_parent'),
          style: "background-color :var(--mat-sys-success)",
          action: ()=>{
            this.studentNotesEndpoints.releaseToParent(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();

                  this.studentNotes.update(arr =>
                      {
                        arr = arr.map(x => x.id === id ? {...x, isReleased: true , releasedAt: new Date() } : x);
                        return arr;
                      }
                    );

                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
                },
                error: error=>{
                  this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
                }
              });
            }  
        },
        width: "80%"
      }
    );
    
  }

  openSolveeDialog(id:number){
    const dialogRef = this.dialog.open(
      GenericDialog, 
      {
        data:{
          title:this.language.transform('solve_note'),
          message: this.language.transform('do_you_want_solve_question'),
          actionTitle: this.language.transform('solve_note'),
          style: "background-color :var(--mat-sys-success)",
          action: ()=>{
            this.studentNotesEndpoints.solve(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                 this.studentNotes.update(arr =>
                      {
                        arr = arr.map(x => x.id === id ? {...x, isSolved: true , solvedAt: new Date()} : x);
                        return arr;
                      }
                    );
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
                },
                error: error=>{
                  this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
                }
              });
            }  
        },
        width: "80%"
      }
    );
    
  }
  // ################ Pagination ################

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
      {
        x.pageSize = pageEvent.pageSize;
        x.pageNumber = pageEvent.pageIndex + 1;  
        return x;
      });
    
    this.setFilterToUrl();
    this.onLoading();
  }  

  setFilterToUrl() {
    this.parmas.setToUrl({
        'pageSize': this.filter().pageSize,
        'pageNumber': this.filter().pageNumber,
        'type': this.form.value.type
      });
  }

  backPage(){
    this.router.navigate(
      this.classId > 0 ? ['/manager/class',this.classId,'students']:['/manager/students']
    );
  }
}
