import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
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
} from '../model/assignment.model';
import { StudentAssignmentAutoComplete } from '../../../shared/components/student-assignment-auto-complete/student-assignment-auto-complete';
import { AddEvaluationDialog } from '../dialog/add-evaluation-dialog/add-evaluation-dialog';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    StudentAssignmentAutoComplete,
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
  fb                  = inject(FormBuilder);
  assignmentEndpoints = inject(AssignmentEndpoints);

  id         = 0;
  assignment = signal<AssignmentResponse | null>(null);

  filterForm = this.fb.group({
    studentId: [null as number | null],
  });

  loadingEval = signal(false);
  evaluations = signal<StudentEvaluationResponse[]>([]);
  totalPages  = signal(0);
  pageNumber  = signal(1);
  pageSize    = signal(10);

  headerTable = ['studentName', 'evaluationRatio', 'description', 'createdByName', 'createdAt'];

  ngOnInit() {
    this.id = +(this.route.snapshot.paramMap.get('id') ?? '0');

    const state = this.router.lastSuccessfulNavigation?.extras?.state as { assignment?: AssignmentResponse } | null;
    if (state?.assignment) {
      this.assignment.set(state.assignment);
    }

    this.filterForm.controls.studentId.valueChanges.subscribe(() => {
      this.pageNumber.set(1);
      this.loadEvaluations();
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
        this.filterForm.value.studentId ?? undefined,
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

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadEvaluations();
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

  goBack() {
    this.router.navigate(['/manager/assignments']);
  }
}
