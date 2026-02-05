import { Component, inject, OnInit, signal } from '@angular/core';
import { StudentEndpoints } from '../../shared/endpoints/student-endpoint';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { ResponsiveScreen } from '../../../../core/services/responsive-screen';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ClassStudentModel } from '../../shared/endpoints/models/student/class-student-model';
import { lengthIfNotNullValidation } from '../../../../core/validator/validator';
import { ClassStudentFilterViewModel } from './view-model/class-student-filter-view-model';
import { errorMatSnackbarConfig } from '../../../../core/consts';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgeGroupAutoComplete } from '../../shared/components/age-group-auto-complete/age-group-auto-complete';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs';
import { ClassStudentInfoDialog } from './Dialog/class-student-info-dialog/class-student-info-dialog';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-class-student',
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
    MatTooltip
],
  templateUrl: './class-student.html',
})
export class ClassStudent implements OnInit{
  studentEndpoints = inject(StudentEndpoints)
  
  // ======== INJECTION ========
  language = inject(Language);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  responsive = inject(ResponsiveScreen);
  fb = inject(FormBuilder);
  router = inject(Router);

  // ======== INPUT PARAMETERS ========
  
  classId :number;

  // ======== Models ========
  filter = signal<ClassStudentFilterViewModel> ({
    pageNumber:1,
    pageSize:10
  })

  totalPages = signal<number>(0); 

  headerTable:string[] = ['name','action'];
  
  dataSource = signal<ClassStudentModel[]>([]);

  loading = signal<boolean>(false);

  form!: FormGroup;

  // ======== Init ========
  constructor() {
    this.form = this.fb.group({
      'name':['',lengthIfNotNullValidation(1,30,'name')],
    });

    this.form.get('name')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(x=>{
      this.onLoading()
    })

    this.classId = +(this.route.snapshot.paramMap.get('id')??'0');
  
    this.filter.update(x=>{
        const param = this.parmas.loadGenericFromUrl();
        
        x.pageSize = param['pageSize']?  param['pageSize']: 10;
        x.pageNumber = param['pageNumber']? param['pageNumber']: 1;
        this.form.patchValue({name: param['pageNumber']})
        return x;
      });
  }

  // ========== Loading ========== 

  ngOnInit(): void {
    this.onLoading();
  }

  onLoading(){
    this.loading.set(true);
    if(this.classId > 0)
    {
      this.studentEndpoints.getStudentsClass(
        this.classId,
        this.form.value.name,
        this.filter().pageNumber,
        this.filter().pageSize
      )
      .subscribe({
        next: x=>{
          this.dataSource.set(x.content);
          
          this.totalPages.set(x.countPages)
          
          this.filter.set({
            pageNumber: this.filter().pageNumber,
            pageSize: this.filter().pageSize
          })

          this.loading.set(false);
        },
        error: error=>{
          this.matSnackBar.open(error.message || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
      
    }  
  }


  // ========== Navigatino + Dialog ==========

  openClassInfoPage(){
    this.router.navigate(['manager','class',this.classId,'info'])
  }

  openStudentExtraInfoDialog(studentId: number){
    const dialogRef = this.dialog.open(ClassStudentInfoDialog, {
            width: "80vw",
            maxWidth: "80vw",
            autoFocus:false,
            data: { 
              studentId: studentId 
            }
          });
      
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.onLoading();
    });
  }

  openStudentNotesPage(studentId:number){
    this.router.navigate(["manager/class",this.classId,"student",studentId,"student-notes"])
  }

  openStudentPointsPage(studentId:number){
    this.router.navigate(["manager/class",this.classId,"student",studentId,"student-points"])
  }

  openStudentAttendancePage(studentId:number){
    this.router.navigate(["manager/class",this.classId,"student",studentId,"student-attendances"])
  }

  openStudentParentVisitsPage(studentId:number){
    this.router.navigate(["manager/class",this.classId,"student",studentId,"student-parent-visits"])
  }

  // ========== Pagination ========== 

   changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
      this.loading();

      this.parmas.setToUrl({
        'pageSize':this.filter().pageSize,
        'pageNumber':this.filter().pageNumber,
        'name':this.form.value.name,
      });
  } 
}
