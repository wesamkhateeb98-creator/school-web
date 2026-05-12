import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { DatePipe } from '@angular/common';
import { Language } from '../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { AssignmentEndpoints } from '../../shared/endpoints/assignment-endpoint';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../shared/endpoints/age-group-endpoint';
import { ClassModel } from '../../shared/endpoints/models/class/class-model';
import { SubjectForAgeGroupModel } from '../../shared/endpoints/models/age-group/subject-for-age-group-model';
import { AssignmentResponse, AssignmentType, ASSIGNMENT_TYPE_LABELS } from './model/assignment.model';
import { AssignmentFormDialog } from './dialog/assignment-form-dialog/assignment-form-dialog';

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
    ReactiveFormsModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignments-page.html',
})
export class AssignmentsPage implements OnInit {
  language          = inject(Language);
  dialog            = inject(MatDialog);
  matSnackBar       = inject(MatSnackBar);
  fb                = inject(FormBuilder);
  assignmentEndpoints = inject(AssignmentEndpoints);
  classEndpoints    = inject(ClassEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  loading       = signal(false);
  assignments   = signal<AssignmentResponse[]>([]);
  classes       = signal<ClassModel[]>([]);
  subjects      = signal<SubjectForAgeGroupModel[]>([]);
  totalPages    = signal(0);
  pageNumber    = signal(1);
  pageSize      = signal(10);

  filterForm!: FormGroup;
  headerTable = ['title', 'type', 'subjectName', 'assignmentAt', 'requiredTime', 'createdAt', 'action'];

  assignmentTypes = Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({
    value: +value as AssignmentType,
    label,
  }));

  ngOnInit() {
    this.filterForm = this.fb.group({
      classId:          [null],
      subjectAgeGroupId:[null],
      type:             [null],
    });

    this.classEndpoints.getByOpenAcademicYear(1, 100).subscribe({
      next: res => this.classes.set(res.content),
    });

    this.filterForm.get('classId')!.valueChanges.subscribe(classId => {
      this.subjects.set([]);
      this.filterForm.patchValue({ subjectAgeGroupId: null }, { emitEvent: false });
      if (classId) {
        this.classEndpoints.getByIdClassForAdmin(classId).subscribe({
          next: cls => {
            this.ageGroupEndpoints.getSubjects(cls.ageGroupId, 1, 100).subscribe({
              next: res => this.subjects.set(res.content),
            });
          },
        });
      }
    });

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

  applyFilter() {
    this.pageNumber.set(1);
    this.load();
  }

  resetFilter() {
    this.filterForm.reset({ classId: null, subjectAgeGroupId: null, type: null });
    this.subjects.set([]);
    this.pageNumber.set(1);
    this.load();
  }

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  getTypeLabel(type: AssignmentType): string {
    return ASSIGNMENT_TYPE_LABELS[type] ?? '';
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
