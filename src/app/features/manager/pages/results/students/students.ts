import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { ClassEndpoints } from '../../../shared/endpoints/class-endpoint';
import { ClassModel } from '../../../shared/endpoints/models/class/class-model';
import { ResultsEndpoints } from '../../../shared/endpoints/results-endpoint';
import { StudentResultListItem, StudentResultListResponse } from '../../../shared/endpoints/models/results/student-result-list-response';
import { YearComputedStatus } from '../../../../../core/enums/year-computed-status';
import { YearFinalStatus } from '../../../../../core/enums/year-final-status';

@Component({
  selector: 'app-results-students',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class ResultsStudentsPage implements OnInit {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  classEndpoints = inject(ClassEndpoints);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  ageGroupId = signal<number | null>(null);
  ageGroupItems = signal<AgeGroupModel[]>([]);

  YearComputedStatus = YearComputedStatus;
  YearFinalStatus = YearFinalStatus;

  loading = signal(false);
  response = signal<StudentResultListResponse | null>(null);
  classItems = signal<ClassModel[]>([]);
  totalPages = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);

  filterForm!: FormGroup;

  get academicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  statusLabelKey(item: StudentResultListItem) {
    if (item.computedStatus === YearComputedStatus.Passed) return 'status_passed_auto_title' as const;
    if (item.finalStatus === YearFinalStatus.PassedWithHelp) return 'status_passed_with_help_title' as const;
    if (item.finalStatus === YearFinalStatus.Failed) return 'status_failed_admin_title' as const;
    return 'status_pending_decision_title' as const;
  }

  statusIcon(item: StudentResultListItem): string {
    if (item.computedStatus === YearComputedStatus.Passed) return 'check_circle';
    if (item.finalStatus === YearFinalStatus.PassedWithHelp) return 'star';
    if (item.finalStatus === YearFinalStatus.Failed) return 'cancel';
    return 'warning';
  }

  /** Shown once above the table so the four status badges below are self-explanatory at a glance. */
  readonly statusLegend = [
    { icon: 'check_circle', labelKey: 'status_passed_auto_title' as const, cssClass: 'results-table__status--1-0' },
    { icon: 'warning', labelKey: 'status_pending_decision_title' as const, cssClass: 'results-table__status--2-0' },
    { icon: 'star', labelKey: 'status_passed_with_help_title' as const, cssClass: 'results-table__status--2-2' },
    { icon: 'cancel', labelKey: 'status_failed_admin_title' as const, cssClass: 'results-table__status--2-3' },
  ];

  ngOnInit(): void {
    const snap = this.route.snapshot.queryParams;

    this.ageGroupEndpoints.get('', 1, 100).subscribe({
      next: page => this.ageGroupItems.set(page.content),
    });

    if (snap['ageGroupId']) this.ageGroupId.set(+snap['ageGroupId']);
    if (snap['pageNumber']) this.pageNumber.set(+snap['pageNumber']);
    if (snap['pageSize']) this.pageSize.set(+snap['pageSize']);

    this.filterForm = this.fb.group({
      classId: [snap['classId'] ? +snap['classId'] : null],
      pendingOnly: [snap['pendingOnly'] === 'true'],
      name: [snap['name'] ?? null],
    });

    if (this.ageGroupId()) {
      this.loadClasses(this.ageGroupId()!);
      this.loadRecords();
    }

    this.filterForm.get('name')!.valueChanges.pipe(debounceTime(400)).subscribe(() => this.onFilterChange());
  }

  onAgeGroupSelect(value: number | null): void {
    this.ageGroupId.set(value);
    this.filterForm.patchValue({ classId: null }, { emitEvent: false });
    this.classItems.set([]);
    if (value) this.loadClasses(value);
    this.onFilterChange();
  }

  togglePendingOnly(): void {
    this.filterForm.patchValue({ pendingOnly: !this.filterForm.value.pendingOnly });
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.pageNumber.set(1);
    this.syncUrl();
    this.loadRecords();
  }

  changePage(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.syncUrl();
    this.loadRecords();
  }

  openStudent(item: StudentResultListItem): void {
    this.router.navigate(['/manager/results/students', item.studentId], {
      queryParams: { ageGroupId: this.ageGroupId(), returnTab: 'students' },
    });
  }

  private loadClasses(ageGroupId: number): void {
    this.classEndpoints.get({
      ageGroup: { id: ageGroupId } as AgeGroupModel,
      academicYear: this.selectedAcademicYearSvc.selected() ?? undefined,
      pageNumber: 1,
      pageSize: 100,
    }).subscribe({
      next: page => this.classItems.set(page.content),
    });
  }

  private loadRecords(): void {
    const ageGroupId = this.ageGroupId();
    const { classId, pendingOnly, name } = this.filterForm.value;
    if (!ageGroupId || !this.academicYearId) {
      this.response.set(null);
      return;
    }
    this.loading.set(true);
    this.resultsEndpoints.getStudents(
      this.academicYearId,
      ageGroupId,
      this.pageNumber(),
      this.pageSize(),
      classId ?? null,
      pendingOnly ? YearComputedStatus.Pending : null,
      null,
      name || null,
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

  private syncUrl(): void {
    const { classId, pendingOnly, name } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ageGroupId: this.ageGroupId(),
        classId: classId ?? null,
        pendingOnly: pendingOnly ? 'true' : null,
        name: name || null,
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }
}
