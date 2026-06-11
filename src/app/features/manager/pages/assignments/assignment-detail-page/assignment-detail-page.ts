import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { AssignmentEndpoints } from '../../../shared/endpoints/assignment-endpoint';
import {
  AssignmentResponse,
  ASSIGNMENT_TYPE_LABELS,
  AssignmentType,
  StudentEvaluationResponse,
  StudentForAssignmentItem,
} from '../model/assignment.model';
import { AddEvaluationDialog } from '../dialog/add-evaluation-dialog/add-evaluation-dialog';
import { DeleteDialog } from '../../../../shared/components/dialogs/delete-dialog/delete-dialog';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-detail-page.html',
})
export class AssignmentDetailPage implements OnInit {
  language            = inject(Language);
  router              = inject(Router);
  route               = inject(ActivatedRoute);
  matSnackBar         = inject(MatSnackBar);
  dialog              = inject(MatDialog);
  assignmentEndpoints = inject(AssignmentEndpoints);

  id         = 0;
  assignment = signal<AssignmentResponse | null>(null);

  // Shared name filter
  nameControl = new FormControl<string>('');

  // Evaluations tab
  loadingEval = signal(false);
  evaluations = signal<StudentEvaluationResponse[]>([]);
  totalPages  = signal(0);
  pageNumber  = signal(1);
  pageSize    = signal(10);

  headerTable = ['studentName', 'evaluationRatio', 'description', 'createdByName', 'createdAt', 'actions'];

  // Unassigned tab
  loadingUnassigned     = signal(false);
  unassignedStudents    = signal<StudentForAssignmentItem[]>([]);
  unassignedTotalPages  = signal(0);
  unassignedPageNumber  = signal(1);
  unassignedPageSize    = signal(10);
  unassignedHeaderTable = ['name', 'unassignedActions'];

  unassignedLoaded = false; // track if tab 2 was ever opened

  ngOnInit() {
    this.id = +(this.route.snapshot.paramMap.get('id') ?? '0');

    const state = this.router.lastSuccessfulNavigation?.extras?.state as { assignment?: AssignmentResponse } | null;
    if (state?.assignment) {
      this.assignment.set(state.assignment);
    }

    this.nameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.pageNumber.set(1);
      this.loadEvaluations();
      if (this.unassignedLoaded) {
        this.unassignedPageNumber.set(1);
        this.loadUnassignedStudents();
      }
    });

    this.loadEvaluations();
  }

  loadEvaluations() {
    this.loadingEval.set(true);
    this.assignmentEndpoints
      .getStudentEvaluations(
        this.id,
        this.pageNumber(),
        this.pageSize(),
        this.nameControl.value || undefined,
      )
      .subscribe({
        next: page => {
          this.evaluations.set(page.content);
          this.totalPages.set(page.countPages);
          this.loadingEval.set(false);
        },
        error: err => {
          this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loadingEval.set(false);
        },
      });
  }

  loadUnassignedStudents() {
    this.loadingUnassigned.set(true);
    this.assignmentEndpoints
      .getUnAssignedStudents(
        this.id,
        this.unassignedPageNumber(),
        this.unassignedPageSize(),
        this.nameControl.value || undefined,
      )
      .subscribe({
        next: page => {
          this.unassignedStudents.set(page.content);
          this.unassignedTotalPages.set(page.countPages);
          this.loadingUnassigned.set(false);
        },
        error: err => {
          this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loadingUnassigned.set(false);
        },
      });
  }

  onTabChange(index: number) {
    if (index === 1) {
      this.unassignedLoaded = true;
      this.loadUnassignedStudents();
    }
  }

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadEvaluations();
  }

  changeUnassignedPage(event: PageEvent) {
    this.unassignedPageNumber.set(event.pageIndex + 1);
    this.unassignedPageSize.set(event.pageSize);
    this.loadUnassignedStudents();
  }

  getTypeLabel(type: AssignmentType): string {
    return ASSIGNMENT_TYPE_LABELS[type] ?? '';
  }

  openAddEvaluation() {
    const ref = this.dialog.open(AddEvaluationDialog, {
      data: { classAssignmentId: this.id },
      width: '420px',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadEvaluations();
    });
  }

  openAddEvaluationForStudent(student: StudentForAssignmentItem) {
    const ref = this.dialog.open(AddEvaluationDialog, {
      data: { classAssignmentId: this.id, preselectedStudent: student },
      width: '420px',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) {
        this.loadEvaluations();
        this.loadUnassignedStudents();
      }
    });
  }

  openUpdateEvaluation(evaluation: StudentEvaluationResponse) {
    const ref = this.dialog.open(AddEvaluationDialog, {
      data: { classAssignmentId: this.id, evaluation },
      width: '420px',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadEvaluations();
    });
  }

  openDeleteEvaluation(evaluation: StudentEvaluationResponse) {
    const ref = this.dialog.open(DeleteDialog, {
      data: {
        title: this.language.transform('delete'),
        action: () => {
          this.assignmentEndpoints.deleteStudentEvaluation(evaluation.id).subscribe({
            next: () => ref.close({ reload: true }),
            error: err => {
              this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              ref.close();
            },
          });
        },
      },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadEvaluations();
    });
  }

  goBack() {
    this.router.navigate(['/manager/assignments']);
  }
}
