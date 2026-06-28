import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
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
import { debounceTime, map, of, startWith, switchMap } from "rxjs";
import { ClassEndpoints } from "../../../../shared/endpoints/class-endpoint";
import { ClassModel } from "../../../../shared/endpoints/models/class/class-model";
import { AccountsEndpoints } from "../../../../shared/endpoints/accounts-endpoint";
import { AgeGroupEndpoints } from "../../../../shared/endpoints/age-group-endpoint";
import { AgeGroupModel } from "../../../../shared/endpoints/models/age-group/age-group-model";
import { SelectedAcademicYearService } from "../../../../../../core/services/selected-academic-year.service";

@Component({
  selector: 'app-assign-teacher-class-dialog',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-for-teacher-dialog.html',
})
export class SubjectForTeacherDialog {
  loading = signal<boolean>(false);

  form!: FormGroup;

  data = inject(MAT_DIALOG_DATA);
  classEndpoints = inject(ClassEndpoints);
  accountsEndpoints = inject(AccountsEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  academicYearSvc = inject(SelectedAcademicYearService);
  dialogRef = inject(MatDialogRef<SubjectForTeacherDialog>);
  language = inject(Language);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);

  ageGroups$ = of<AgeGroupModel[]>([]);
  classes$ = of<ClassModel[]>([]);

  selectedAgeGroup = signal<AgeGroupModel | null>(null);

  key: string = crypto.randomUUID();

  headerTable: string[] = ['ageGroupName', 'academicYear', 'section', 'createdAt', 'action'];

  filter = signal<{ pageSize: number; pageNumber: number }>({
    pageSize: 10,
    pageNumber: 1
  });

  totalPages = signal<number>(1);

  assignedClasses = signal<ClassModel[]>([]);

  ngOnInit() {
    this.loadClasses();
    this.initiateForm();
    this.setupAutocompletes();
  }

  loadClasses() {
    this.loading.set(true);
    this.classEndpoints.getByAccountIdYear(
      this.filter().pageNumber,
      this.filter().pageSize,
      this.data.teacherId
    ).subscribe({
      next: (success) => {
        this.assignedClasses.set(success.content);
        this.totalPages.set(success.countPages);
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  initiateForm() {
    this.form = this.fb.group({
      ageGroup: [''],
      classId: ['', [Validators.required]],
      class: [{ value: '', disabled: true }],
    });
  }

  setupAutocompletes() {
    this.ageGroups$ = this.form.get('ageGroup')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        const name = typeof value === 'string' ? value : '';
        return this.ageGroupEndpoints.get(name, 1, 20);
      }),
      map(response => response.content),
    );

    this.classes$ = this.form.get('class')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(() => {
        const ageGroup = this.selectedAgeGroup();
        const academicYear = this.academicYearSvc.selected();
        if (!ageGroup || !academicYear) return of({ content: [] as ClassModel[] });
        return this.classEndpoints.get({
          ageGroup,
          academicYear,
          pageNumber: 1,
          pageSize: 10
        });
      }),
      map(response => response.content),
    );
  }

  onAgeGroupSelected(event: any) {
    const ageGroup: AgeGroupModel = event.option.value;
    this.selectedAgeGroup.set(ageGroup);
    this.form.get('class')!.enable();
    this.form.patchValue({ class: '', classId: '' });
  }

  displayAgeGroup(item: AgeGroupModel): string {
    return item?.name ?? '';
  }

  onClassSelected(event: any) {
    this.form.patchValue({ classId: event.option.value.id });
  }

  displayClass(item: ClassModel): string {
    return item ? `${item.ageGroupName} - ${item.section}` : '';
  }

  assignTeacher() {
    this.loading.set(true);

    this.accountsEndpoints.assignTeacher(this.data.teacherId, this.form.value.classId, this.key).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform("success"), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.loadClasses();
        this.key = crypto.randomUUID();
      },
      error: (err) => {
        this.matSnackBar.open(err.error?.Title || err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  unassignClass(assignmentId: number) {
    this.loading.set(true);

    this.accountsEndpoints.unassingAccount(this.data.teacherId, assignmentId).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform("success"), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.assignedClasses.update(x => x.filter(c => c.id !== assignmentId));
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  changeInPage(pageEvent: PageEvent) {
    this.filter.update(x => {
      x.pageSize = pageEvent.pageSize;
      x.pageNumber = pageEvent.pageIndex + 1;
      return x;
    });
    this.loadClasses();
  }
}
