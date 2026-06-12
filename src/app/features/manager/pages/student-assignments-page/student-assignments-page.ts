import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../core/consts';
import { AssignmentEndpoints } from '../../shared/endpoints/assignment-endpoint';
import {
  ASSIGNMENT_TYPE_LABELS,
  AssignmentType,
  StudentAssignmentReportItem,
  SubjectForStudentItem,
} from '../assignments/model/assignment.model';
import { AcademicYearSemesterAutoComplete } from '../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';

@Component({
  selector: 'app-student-assignments-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    AcademicYearSemesterAutoComplete,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-assignments-page.html',
})
export class StudentAssignmentsPage implements OnInit {
  language            = inject(Language);
  router              = inject(Router);
  route               = inject(ActivatedRoute);
  matSnackBar         = inject(MatSnackBar);
  fb                  = inject(FormBuilder);
  assignmentEndpoints = inject(AssignmentEndpoints);

  studentId = 0;
  classId   = 0;

  loading    = signal(false);
  items      = signal<StudentAssignmentReportItem[]>([]);
  totalPages = signal(0);
  pageNumber = signal(1);
  pageSize   = signal(10);

  headerTable = [
    'assignmentTitle',
    'subjectName',
    'assignmentType',
    'assignmentAt',
    'isCompleted',
    'evaluationRatio',
    'description',
  ];

  filterForm!: FormGroup;

  // subject autocomplete
  subjectControl        = new FormControl<SubjectForStudentItem | string | null>(null);
  subjectItems          = signal<SubjectForStudentItem[]>([]);
  subjectDisplayFn      = (item?: SubjectForStudentItem | null): string =>
    item?.subjectName ?? '';

  ngOnInit() {
    this.studentId = +(this.route.snapshot.paramMap.get('id')      ?? '0');
    this.classId   = +(this.route.snapshot.paramMap.get('classId') ?? '0');

    this.filterForm = this.fb.group({
      isCompleted:      [null as boolean | null],
      subjectAgeGroupId: [null as number | null],
      // 'semester' + 'semesterId' added by AcademicYearSemesterAutoComplete
    });

    // load subjects when user types
    this.subjectControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        const name = typeof value === 'string' ? value : '';
        return this.assignmentEndpoints.getSubjectForStudent(
          this.studentId, 1, 20, name || undefined,
        ).pipe(catchError(() => of(null)));
      }),
    ).subscribe(page => { if (page) this.subjectItems.set(page.content); });

    // initial load of subjects list
    this.assignmentEndpoints.getSubjectForStudent(this.studentId, 1, 20)
      .subscribe(page => this.subjectItems.set(page.content));

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ).subscribe(() => {
      this.pageNumber.set(1);
      this.load();
    });

    this.load();
  }

  load() {
    this.loading.set(true);
    const { isCompleted, semesterId, subjectAgeGroupId } = this.filterForm.value;

    this.assignmentEndpoints
      .getAdminStudentAssignments(
        this.studentId,
        this.pageNumber(),
        this.pageSize(),
        semesterId        ?? undefined,
        subjectAgeGroupId ?? undefined,
        isCompleted       ?? undefined,
      )
      .subscribe({
        next: page => {
          this.items.set(page.content);
          this.totalPages.set(page.countPages);
          this.loading.set(false);
        },
        error: err => {
          this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        },
      });
  }

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  onSubjectSelected(item: SubjectForStudentItem) {
    this.filterForm.patchValue({ subjectAgeGroupId: item.subjectAgeGroupId });
  }

  clearSubject() {
    this.subjectControl.setValue(null);
    this.filterForm.patchValue({ subjectAgeGroupId: null });
  }

  getTypeLabel(type: AssignmentType): string {
    return ASSIGNMENT_TYPE_LABELS[type] ?? '';
  }

  goBack() {
    this.router.navigate(['/manager/class', this.classId, 'students']);
  }
}
