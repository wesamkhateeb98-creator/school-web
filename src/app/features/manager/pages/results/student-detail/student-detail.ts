import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { ResultsEndpoints } from '../../../shared/endpoints/results-endpoint';
import { StudentResultDetailResponse } from '../../../shared/endpoints/models/results/student-result-detail-response';

@Component({
  selector: 'app-student-result-detail',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.scss',
})
export class StudentResultDetailPage implements OnInit {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  studentId!: number;
  loading = signal(true);
  detail = signal<StudentResultDetailResponse | null>(null);

  ngOnInit(): void {
    this.studentId = +(this.route.snapshot.paramMap.get('id') ?? '0');
    const academicYearId = this.selectedAcademicYearSvc.selectedId();
    if (!academicYearId || this.studentId <= 0) {
      this.loading.set(false);
      return;
    }
    this.resultsEndpoints.getStudentDetail(this.studentId, academicYearId).subscribe({
      next: response => {
        this.detail.set(response);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  isFailedDespiteAverage(subject: StudentResultDetailResponse['subjects'][number]): boolean {
    return !subject.isPassed && subject.finalMark >= subject.minPassGrade;
  }

  goBack(): void {
    const { ageGroupId, returnTab } = this.route.snapshot.queryParams;
    this.router.navigate(['/manager/results'], {
      queryParams: { ageGroupId: ageGroupId ?? null, tab: returnTab ?? 'students' },
    });
  }

  openTransferLog(): void {
    this.router.navigate(['/manager/results/students', this.studentId, 'transfer-log'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }
}
