import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { ResultsEndpoints } from '../../../shared/endpoints/results-endpoint';
import { StudentResultListItem, StudentResultListResponse } from '../../../shared/endpoints/models/results/student-result-list-response';
import { YearComputedStatus } from '../../../../../core/enums/year-computed-status';
import { DecideDialog } from './dialog/decide-dialog/decide-dialog';

@Component({
  selector: 'app-decision',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './decision.html',
  styleUrl: './decision.scss',
})
export class DecisionPage implements OnInit, OnChanges {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  /** Shared with the results center — changing it here updates every other tab too. */
  @Input() ageGroupId: number | null = null;
  @Input() ageGroupItems: AgeGroupModel[] = [];
  @Output() ageGroupIdChange = new EventEmitter<number | null>();

  /** Deciding a pending case can clear the year-scope pipeline's "decision" stage — tell the results center to refresh its shared bar. */
  @Output() pipelineRefresh = new EventEmitter<void>();

  loading = signal(false);
  response = signal<StudentResultListResponse | null>(null);
  selectedIds = signal<Set<number>>(new Set());
  totalPages = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);

  get academicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  ngOnInit(): void {
    if (this.ageGroupId) this.loadRecords();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ageGroupId'] && !changes['ageGroupId'].firstChange) {
      this.onFilterChange();
    }
  }

  onFilterChange(): void {
    this.selectedIds.set(new Set());
    this.pageNumber.set(1);
    this.loadRecords();
  }

  onAgeGroupSelect(value: number | null): void {
    this.ageGroupIdChange.emit(value);
  }

  changePage(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadRecords();
  }

  toggleSelect(studentId: number): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(studentId)) next.delete(studentId); else next.add(studentId);
      return next;
    });
  }

  isSelected(studentId: number): boolean {
    return this.selectedIds().has(studentId);
  }

  decideOne(item: StudentResultListItem, passed: boolean): void {
    if (!this.academicYearId) return;
    const ref = this.dialog.open(DecideDialog, {
      width: '45%',
      data: { studentIds: [item.studentId], passed, academicYearId: this.academicYearId },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) {
        this.loadRecords();
        this.pipelineRefresh.emit();
      }
    });
  }

  decideBulk(passed: boolean): void {
    if (!this.academicYearId || this.selectedIds().size === 0) return;
    const ref = this.dialog.open(DecideDialog, {
      width: '45%',
      data: { studentIds: Array.from(this.selectedIds()), passed, academicYearId: this.academicYearId },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) {
        this.selectedIds.set(new Set());
        this.loadRecords();
        this.pipelineRefresh.emit();
      }
    });
  }

  openDetails(item: StudentResultListItem): void {
    this.router.navigate(['/manager/results/students', item.studentId], {
      queryParams: { ageGroupId: this.ageGroupId, returnTab: 'decision' },
    });
  }

  private loadRecords(): void {
    if (!this.ageGroupId || !this.academicYearId) {
      this.response.set(null);
      return;
    }
    this.loading.set(true);
    this.resultsEndpoints.getStudents(
      this.academicYearId,
      this.ageGroupId,
      this.pageNumber(),
      this.pageSize(),
      null,
      YearComputedStatus.Pending,
      null,
      null,
    ).subscribe({
      next: response => {
        this.response.set(response);
        this.totalPages.set(response.students.countPages);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }
}
