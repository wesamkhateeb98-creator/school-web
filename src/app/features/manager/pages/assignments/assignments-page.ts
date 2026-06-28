import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { DatePipe } from '@angular/common';
import { Language } from '../../../../core/services/language';
import { Router } from '@angular/router';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../core/services/selected-academic-year.service';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { AssignmentEndpoints } from '../../shared/endpoints/assignment-endpoint';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { ClassModel } from '../../shared/endpoints/models/class/class-model';
import { AssignmentResponse, AssignmentType, ASSIGNMENT_TYPE_LABELS } from './model/assignment.model';
import { AssignmentFormDialog } from './dialog/assignment-form-dialog/assignment-form-dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { ResponsiveScreen } from '../../../../core/services/responsive-screen';
import { SubjectAgeGroupAutoComplete } from '../../shared/components/subject-age-group-auto-complete/subject-age-group-auto-complete';

@Component({
  selector: 'app-assignments-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
    DatePipe,
    SubjectAgeGroupAutoComplete,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignments-page.html',
})
export class AssignmentsPage implements OnInit {
  language            = inject(Language);
  router              = inject(Router);
  dialog              = inject(MatDialog);
  matSnackBar         = inject(MatSnackBar);
  fb                  = inject(FormBuilder);
  params              = inject(ParamsService);
  responsive          = inject(ResponsiveScreen);
  assignmentEndpoints     = inject(AssignmentEndpoints);
  classEndpoints          = inject(ClassEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  loading        = signal(false);
  assignments    = signal<AssignmentResponse[]>([]);
  classes        = signal<ClassModel[]>([]);
  filterAgeGroupId = signal<number | null>(null);
  totalPages     = signal(0);
  pageNumber     = signal(1);
  pageSize       = signal(10);

  filterForm!: FormGroup;
  urlSubjectId: number | null = null;

  headerTable = ['title', 'type', 'className', 'subjectName', 'assignmentAt', 'assignmentTime', 'createdAt', 'action'];

  assignmentTypes = Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({
    value: +value as AssignmentType,
    label,
  }));

  ngOnInit() {
    const urlParams  = this.params.loadGenericFromUrl();
    const urlClassId = urlParams['classId']          ? +urlParams['classId']          : null;
    const urlType    = urlParams['type'] != null      ? +urlParams['type']             : null;
    this.urlSubjectId = urlParams['subjectAgeGroupId'] ? +urlParams['subjectAgeGroupId'] : null;

    if (urlParams['pageNumber']) this.pageNumber.set(+urlParams['pageNumber']);
    if (urlParams['pageSize'])   this.pageSize.set(+urlParams['pageSize']);

    this.filterForm = this.fb.group({
      classId:          [urlClassId],
      subjectAgeGroupId:[this.urlSubjectId],
      type:             [urlType],
    });

    this.classEndpoints.get({
      academicYear: this.selectedAcademicYearSvc.selected() ?? undefined,
      pageNumber: 1,
      pageSize: 100,
    }).subscribe({
      next: res => this.classes.set(res.content),
    });

    this.filterForm.get('classId')!.valueChanges.subscribe(classId => {
      this.filterAgeGroupId.set(null);
      if (classId) {
        this.classEndpoints.getByIdClassForAdmin(classId).subscribe({
          next: cls => this.filterAgeGroupId.set(cls.ageGroupId),
        });
      }
    });

    if (urlClassId) {
      this.classEndpoints.getByIdClassForAdmin(urlClassId).subscribe({
        next: cls => this.filterAgeGroupId.set(cls.ageGroupId),
      });
    }

    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilter());

    this.load();
  }

  load() {
    this.loading.set(true);
    const { classId, subjectAgeGroupId, type } = this.filterForm?.value ?? {};
    this.assignmentEndpoints.get(
      this.pageNumber(),
      this.pageSize(),
      classId || undefined,
      subjectAgeGroupId || undefined,
      type !== null && type !== undefined ? type : undefined,
    ).subscribe({
      next: page => {
        this.assignments.set(page.content);
        this.totalPages.set(page.countPages);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  private syncUrl() {
    const { classId, subjectAgeGroupId, type } = this.filterForm.value;
    this.params.setToUrl({
      classId:          classId          ?? null,
      subjectAgeGroupId:subjectAgeGroupId ?? null,
      type:             type !== null && type !== undefined ? type : null,
      pageNumber:       this.pageNumber(),
      pageSize:         this.pageSize(),
    });
  }

  applyFilter() {
    this.pageNumber.set(1);
    this.syncUrl();
    this.load();
  }

  resetFilter() {
    this.filterAgeGroupId.set(null);
    this.pageSize.set(10);
    this.filterForm.reset({ classId: null, subjectAgeGroupId: null, type: null });
  }

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.syncUrl();
    this.load();
  }

  getTypeLabel(type: AssignmentType): string {
    return ASSIGNMENT_TYPE_LABELS[type] ?? '';
  }

  goToDetail(row: AssignmentResponse) {
    this.router.navigate(['/manager/assignments', row.id], { state: { assignment: row } });
  }

  openAddDialog() {
    const ref = this.dialog.open(AssignmentFormDialog, { width: '60%', data: {} });
    ref.afterClosed().subscribe(result => { if (result?.reload) this.load(); });
  }

  openEditDialog(assignment: AssignmentResponse) {
    const ref = this.dialog.open(AssignmentFormDialog, { width: '60%', data: { assignment } });
    ref.afterClosed().subscribe(result => { if (result?.reload) this.load(); });
  }

  openDeleteDialog(assignment: AssignmentResponse) {
    const ref = this.dialog.open(DeleteDialog, {
      width: '40%',
      data: {
        title: this.language.transform('delete_assignment'),
        action: () => {
          this.assignmentEndpoints.delete(assignment.id).subscribe({
            next: () => {
              ref.close();
              this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
              this.assignments.update(list => list.filter(a => a.id !== assignment.id));
            },
            error: err => {
              this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            },
          });
        },
      },
    });
  }
}
