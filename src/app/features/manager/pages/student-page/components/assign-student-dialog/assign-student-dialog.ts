import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Language } from '../../../../../../core/services/language';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassModel } from '../../../../endpoints/models/class/class-model';
import { debounceTime, map, of, startWith, switchMap, tap } from 'rxjs';
import { ClassEndpoints } from '../../../../endpoints/class-endpoint';
import { AsyncPipe } from '@angular/common';
import { AccountsEndpoints } from '../../../../endpoints/accounts-endpoint';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { AssignmentFilter } from '../../view-model/assignment-filter';

@Component({
  selector: 'app-account-code-dialog',
  imports: [
    MatDialogContent, MatFormField, MatLabel, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
],
  templateUrl: './assign-student-dialog.html',
})
export class AssignStudentDialog implements OnInit {
  loading = signal<boolean>(false);
  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  classEndpoints = inject(ClassEndpoints);
  accountEndpoint = inject(AccountsEndpoints);
  dialogRef = inject(MatDialogRef<AssignStudentDialog>);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);

  existingCode = signal<boolean>(true);

  class$ = of<ClassModel[]>([]);
  key:string = crypto.randomUUID();
  
  headerTable:string[] = [
    'ageGrouoName',
    'academicYear',
    'section',
    'createdAt',
    'action'
  ];

  classes = signal<ClassModel[]>([]);

  filter = signal<AssignmentFilter>(
      {
        pageNumber:1,
        pageSize:10
      }
    );

  totalPages = signal<number>(1);

  ngOnInit() {
    this.loadClassesForAccount()
    this.initiateForm();
    
    this.setupAutocompletes();
  }

  loadClassesForAccount(){
    this.loading.set(true);
    
    const result = this.classEndpoints.getByAccountIdYear(1,10,this.data.accountId)

    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.classes.set(success.content)
        
        this.loading.set(false);
        
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        
        this.loading.set(false);
      }
    })
  }

   initiateForm() {

    this.form = this.fb.group({
      classId: ['', [Validators.required]],
      class: [''],
    });
  }
  setupAutocompletes() {
    this.class$ = this.form.get('class')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.classEndpoints.getByOpenAcademicYear(1, 20,this.data.ageGroupId);
      }),
      map(response => response.content),
    );
  }

  submit(){
    this.loading.set(true);
    
    const result = this.accountEndpoint.assignStudent(this.data.accountId,this.form.get('classId')?.value,this.key)

    result.subscribe({
      next:(success)=>{
        this.dialogRef.close()
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.loading.set(false);
        
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        
        this.loading.set(false);
      }
    })
  }

  UnassingAccount(id:number){
    this.loading.set(true);
    
    const result = this.accountEndpoint.unassingAccount(this.data.accountId,id)

    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        this.classes.update(x=> x.filter(x=>x.id != id))

        this.loading.set(false);
        
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        
        this.loading.set(false);
      }
    })
  }

  onClassSelected(event: any) {
    this.form.patchValue({ classId: event.option.value.id });
  }

  displayAgeGroup(item: ClassModel): string {
    return item?`${item.ageGroupName} ${item.section}`:"";
  }

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
      this.loading();

      this.loadClassesForAccount();
  }  
}
