import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe, DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatExpansionPanel, MatExpansionPanelHeader } from "@angular/material/expansion";
import { SubjectEndpoints } from "../../../../shared/endpoints/subject-endpoint";
import { SubjectViewModel } from "../../../subject/model/subject-view-model";
import { debounceTime, map, of, startWith, switchMap } from "rxjs";
import { TeacherEndpoints } from "../../../../shared/endpoints/teacher-endpoint";
import { SubjectForTeacherModel } from "../../../../shared/endpoints/models/teacher/subject-for-teacher-model";
import { SubjectForAgeGroupFilterViewModel } from "../../../age-group/model/subject-filter-view-model";

@Component({
  selector: 'app-add-academic-year-dialog',
  imports: [
    MatDialogContent, MatFormField, MatLabel, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AsyncPipe, DatePipe,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatGridListModule
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-for-teacher-dialog.html',
})
export class SubjectForTeacherDialog {
  loading = signal<boolean>(false);

  form!: FormGroup;
  
  data = inject(MAT_DIALOG_DATA);
  
  subjectEndpoints = inject(SubjectEndpoints);
  
  teacherEndpoints = inject(TeacherEndpoints);
  
  dialogRef = inject(MatDialogRef<SubjectForTeacherDialog>);
  
  language = inject(Language);
  
  fb = inject(FormBuilder);
  
  matSnackBar = inject(MatSnackBar);

  existingCode = signal<boolean>(true);

  subjects$ = of<SubjectViewModel[]>([]);
  
  key:string = crypto.randomUUID();
  
  headerTable:string[] = ['subject','description','createdAt','action'];
  
  filter = signal<SubjectForAgeGroupFilterViewModel>({
    pageSize: 10,
    pageNumber: 1
  });

  totalPages = signal<number>(1);

  assignedSubjects = signal<SubjectForTeacherModel[]>([]);

  ngOnInit() {
    this.loadSubjects();

    this.initiateForm();
    
    this.setupAutocompletes();
  }

  loadSubjects(){
    this.loading.set(true);
    const result = this.teacherEndpoints.getSubjects(this.data.teacherId,this.filter().pageNumber,this.filter().pageSize);

    result.subscribe({
      next:(success)=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.assignedSubjects.set(success.content)        
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
      subjectId: ['', [Validators.required]],
      subject: [''],
    });
  }

  setupAutocompletes() {
    this.subjects$ = this.form.get('subject')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.subjectEndpoints.get(1, 20,value);
      }),
      map(response => response.content),
    );
  }

  addSubject(){
    this.loading.set(true);

    this.teacherEndpoints.addSubject(this.data.teacherId,this.form.value.subjectId)
      .subscribe({
        next: success => {
           this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
            this.assignedSubjects.update(x=> {
              x.unshift({
                subjectTeacherId: success.id,
                name:this.form.value.subject.name,
                description: this.form.value.subject.description,
                subjectId: this.form.value.subject.id,
                createdAt: new Date()
              })
              return x;
            });

            this.loading.set(false);
        },
        error: error =>{
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        
          this.loading.set(false);
        }
      })
  }

  removeSubject(id:number){
    this.loading.set(true);
    
    const result = this.teacherEndpoints.deleteSubject(this.data.teacherId,id)

    result.subscribe({
      next:(success)=>{
        
        this.assignedSubjects.update(x=> x.filter(x=>x.subjectTeacherId != id))

        this.loading.set(false);
        
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        
        this.loading.set(false);
      }
    })
  }

  onSubjectSelected(event: any) {
    this.form.patchValue({ subjectId: event.option.value.id });
  }

  displaySubject(item: SubjectViewModel): string {
    return item?item.name:"";
  }

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
    
      this.loadSubjects()
  }  
}

