import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { MutateResponse } from "../../../../../shared/model/mutate-response";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { yearMonthDay } from "../../../../../../core/formats/date-format";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { AgeGroupViewModel } from "../../model/age-group-view-model";
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
import { SubjectForAgeGroupFilterViewModel } from "../../model/subject-filter-view-model";
import { AgeGroupEndpoints } from "../../../../shared/endpoints/age-group-endpoint";
import { subjectForAgeGroupModel } from "../../../../shared/endpoints/models/age-group/subject-for-age-group-model";

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
  templateUrl: './subject-in-age-group-dialog.html',
})
export class SubjectInAgeGroupDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA); // AgeGroupId
  subjectEndpoints = inject(SubjectEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  dialogRef = inject(MatDialogRef<SubjectInAgeGroupDialog>);
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

  assignedSubjects = signal<subjectForAgeGroupModel[]>([]);

  ngOnInit() {
    this.loadSubjects();

    this.initiateForm();
    
    this.setupAutocompletes();
  }

  loadSubjects(){
    this.loading.set(true);
    const result = this.ageGroupEndpoints.getSubjects(this.data.ageGroupId,this.filter().pageNumber,this.filter().pageSize);

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

    this.ageGroupEndpoints.addSubject(this.data.ageGroupId,this.form.value.subjectId)
      .subscribe({
        next: success => {
           this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
            this.assignedSubjects.update(x=> {
              x.unshift({
                id: success.id,
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
    
    const result = this.ageGroupEndpoints.deleteSubject(this.data.ageGroupId,id)

    result.subscribe({
      next:(success)=>{
        
        this.assignedSubjects.update(x=> x.filter(x=>x.id != id))

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

