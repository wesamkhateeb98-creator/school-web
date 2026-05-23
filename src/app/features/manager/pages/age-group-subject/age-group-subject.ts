import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../core/services/language";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../core/consts";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe, DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatExpansionPanel, MatExpansionPanelHeader } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SubjectEndpoints } from "../../shared/endpoints/subject-endpoint";
import { SubjectViewModel } from "../subject/model/subject-view-model";
import { debounceTime, map, of, startWith, switchMap } from "rxjs";
import { SubjectForAgeGroupFilterViewModel } from "../age-group/model/subject-filter-view-model";
import { AgeGroupEndpoints } from "../../shared/endpoints/age-group-endpoint";
import { SubjectForAgeGroupModel } from "../../shared/endpoints/models/age-group/subject-for-age-group-model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-add-academic-year-dialog',
  imports: [
    MatFormField, MatLabel,
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
    MatGridListModule,
    MatTooltipModule,
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './age-group-subject.html',
})
export class AgeGroupSubject {
  // #################################### Injection ####################################
  loading = signal<boolean>(false);
  form!: FormGroup;
  subjectEndpoints = inject(SubjectEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // #################################### Data ####################################

  existingCode = signal<boolean>(true);
  subjects$ = of<SubjectViewModel[]>([]);
  key:string = crypto.randomUUID();
  headerTable:string[] = ['subject','description','minPassGrade','maxGrade','createdAt','action'];
  filter = signal<SubjectForAgeGroupFilterViewModel>({
    pageSize: 10,
    pageNumber: 1
  });
  totalPages = signal<number>(1);
  assignedSubjects = signal<SubjectForAgeGroupModel[]>([]);
  selectedForEdit = signal<SubjectForAgeGroupModel | null>(null);
  updateForm!: FormGroup;

  ageGroupId:number = 0;

  ngOnInit() {
    this.ageGroupId = +(this.route.snapshot.paramMap.get('ageGroupId')??'0');


    this.loadSubjects();

    this.initiateForm();
    this.initiateUpdateForm();
    this.setupAutocompletes();
  }

  loadSubjects(){
    this.loading.set(true);
    const result = this.ageGroupEndpoints.getSubjects(this.ageGroupId,this.filter().pageNumber,this.filter().pageSize);

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
      maxGrade: [0, [Validators.required, Validators.min(0)]],
      minPassGrade: [0, [Validators.required, Validators.min(0)]],
    });
  }

  initiateUpdateForm() {
    this.updateForm = this.fb.group({
      maxGrade: [0, [Validators.required, Validators.min(0)]],
      minPassGrade: [0, [Validators.required, Validators.min(0)]],
    });
  }

  startEdit(element: SubjectForAgeGroupModel) {
    this.selectedForEdit.set(element);
    this.updateForm.patchValue({
      maxGrade: element.maxGrade,
      minPassGrade: element.minPassGrade,
    });
  }

  cancelEdit() {
    this.selectedForEdit.set(null);
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
    const { subjectId, subject, maxGrade, minPassGrade } = this.form.value;

    this.ageGroupEndpoints.addSubject(this.ageGroupId, subjectId, maxGrade, minPassGrade)
      .subscribe({
        next: success => {
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));

          this.assignedSubjects.update(x => {
            x.unshift({
              id: success.id,
              name: subject.name,
              description: subject.description,
              subjectId: subject.id,
              maxGrade,
              minPassGrade,
              createdAt: new Date()
            });
            return x;
          });

          this.loading.set(false);
        },
        error: error => {
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
  }

  updateSubject() {
    const editing = this.selectedForEdit();
    if (!editing) return;

    this.loading.set(true);
    const { maxGrade, minPassGrade } = this.updateForm.value;

    this.ageGroupEndpoints.updateSubject(this.ageGroupId, editing.id, maxGrade, minPassGrade)
      .subscribe({
        next: () => {
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));

          this.assignedSubjects.update(list =>
            list.map(x => x.id === editing.id ? { ...x, maxGrade, minPassGrade } : x)
          );

          this.selectedForEdit.set(null);
          this.loading.set(false);
        },
        error: error => {
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
  }

  removeSubject(id:number){
    this.loading.set(true);
    
    const result = this.ageGroupEndpoints.deleteSubject(this.ageGroupId,id)

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

  OpenStudyPlanPage(ageGroupSubjectId:number){
    this.router.navigate(['manager/age-group',this.ageGroupId,'subject',ageGroupSubjectId,'study-plan'])
    // this.dialogRef.close()
  }

  operAgeGroupPage(){
    this.router.navigate(['manager/age-group'])
  }

  openMarkDistributionPage(subjectAgeGroupId: number): void {
    this.router.navigate(['manager/age-group', this.ageGroupId, 'subject', subjectAgeGroupId, 'mark-distribution']);
  }
}

