import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { Language } from '../../../../core/services/language';
import { PhrasesType } from '../../../../core/resource/phrases';
import { SelectedAcademicYearService } from '../../../../core/services/selected-academic-year.service';
import { StudentEndpoints } from '../../shared/endpoints/student-endpoint';
import { TeacherEndpoints } from '../../shared/endpoints/teacher-endpoint';
import { AdministrativeStaffEndpoints } from '../../shared/endpoints/administrative-staff-endpoint';
import { SubjectEndpoints } from '../../shared/endpoints/subject-endpoint';
import { AssignmentEndpoints } from '../../shared/endpoints/assignment-endpoint';
import { AgeGroupEndpoints } from '../../shared/endpoints/age-group-endpoint';
import { ResultsEndpoints } from '../../shared/endpoints/results-endpoint';
import { StudentFilterViewModel } from '../student-page/view-model/student-filter-view-model';
import { TeacherFilterViewModel } from '../teacher-page/view-model/teacher-filter-view-model';
import { AdministrativeStaffFilterViewModel } from '../administrative-staff-page/view-model/administrative-staff-filter-view-model';
import { AgeGroupModel } from '../../shared/endpoints/models/age-group/age-group-model';
import { PipelineStage } from '../../../../core/enums/pipeline-stage';

interface QuickLink {
  name: PhrasesType;
  icon: string;
  url: string;
  color: string;
}

interface QuickLinkGroup {
  title: PhrasesType;
  links: QuickLink[];
}

interface StatCard {
  key: PhrasesType;
  icon: string;
  color: string;
  url: string;
  value: number | null;
}

interface GradeRow {
  ageGroupId: number;
  name: string;
  studentCount: number | null;
  stage: number | null;
}

const STAGE_LABEL: Record<number, PhrasesType> = {
  [PipelineStage.Entry]: 'stage_entry_title',
  [PipelineStage.Generation]: 'stage_generation_title',
  [PipelineStage.Decision]: 'stage_decision_title',
  [PipelineStage.Publish]: 'stage_publish_title',
  [PipelineStage.Promotion]: 'stage_promotion_title',
  [PipelineStage.Completed]: 'stage_completed_title',
};

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, MatProgressBarModule, MatRippleModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  language = inject(Language);

  private studentApi = inject(StudentEndpoints);
  private teacherApi = inject(TeacherEndpoints);
  private staffApi = inject(AdministrativeStaffEndpoints);
  private subjectApi = inject(SubjectEndpoints);
  private assignmentApi = inject(AssignmentEndpoints);
  private ageGroupApi = inject(AgeGroupEndpoints);
  private resultsApi = inject(ResultsEndpoints);
  private selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  studentsCount = signal<number | null>(null);
  teachersCount = signal<number | null>(null);
  staffCount = signal<number | null>(null);
  subjectsCount = signal<number | null>(null);
  assignmentsCount = signal<number | null>(null);

  gradeRows = signal<GradeRow[]>([]);
  gradeRowsLoading = signal(true);

  /** Emits once the selected academic year is known — resolves immediately if it's already loaded, otherwise waits for it. Avoids a race where the dashboard mounts before SelectedAcademicYearService's own initial fetch resolves. */
  private academicYearId$ = toObservable(this.selectedAcademicYearSvc.selectedId);

  today = new Intl.DateTimeFormat(this.language.getLanguageCode(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  stats = computed<StatCard[]>(() => [
    { key: 'students_title',    icon: 'escalator_warning', color: 'var(--mat-sys-primary)',   url: '/manager/students',    value: this.studentsCount() },
    { key: 'managerial_title',  icon: 'manage_accounts',   color: 'var(--mat-sys-secondary)', url: '/manager/managerial',  value: this.staffCount() },
    { key: 'teachers_title',    icon: 'school',            color: 'var(--mat-sys-tertiary)',  url: '/manager/teachers',    value: this.teachersCount() },
    { key: 'subject_title',     icon: 'menu_book',         color: 'var(--gold-500)',          url: '/manager/subjects',    value: this.subjectsCount() },
    { key: 'assignments_title', icon: 'assignment',        color: 'var(--gold-500)',          url: '/manager/assignments', value: this.assignmentsCount() },
  ]);

  quickLinkGroups: QuickLinkGroup[] = [
    {
      title: 'group_academic_title',
      links: [
        { name: 'classes_title',       icon: 'door_sliding',   url: '/manager/classes',       color: 'var(--mat-sys-primary)' },
        { name: 'academic_year_title', icon: 'calendar_today', url: '/manager/academic-year', color: 'var(--mat-sys-primary)' },
        { name: 'semester_title',      icon: 'event_note',     url: '/manager/semster',       color: 'var(--mat-sys-primary)' },
        { name: 'subject_title',       icon: 'menu_book',      url: '/manager/subjects',       color: 'var(--mat-sys-primary)' },
        { name: 'age_group_title',     icon: 'groups',         url: '/manager/age-group',     color: 'var(--mat-sys-primary)' },
      ],
    },
    {
      title: 'group_people_title',
      links: [
        { name: 'students_title',   icon: 'escalator_warning', url: '/manager/students',   color: 'var(--mat-sys-tertiary)' },
        { name: 'teachers_title',   icon: 'school',             url: '/manager/teachers',   color: 'var(--mat-sys-tertiary)' },
        { name: 'managerial_title', icon: 'manage_accounts',   url: '/manager/managerial', color: 'var(--mat-sys-tertiary)' },
      ],
    },
    {
      title: 'group_records_title',
      links: [
        { name: 'assignments_title',           icon: 'assignment', url: '/manager/assignments', color: 'var(--gold-500)' },
        { name: 'results_promotion_group_title', icon: 'fact_check', url: '/manager/results',   color: 'var(--gold-500)' },
      ],
    },
  ];

  constructor() {
    this.studentApi.get(new StudentFilterViewModel(1, 1)).subscribe({
      next: page => this.studentsCount.set(page.countPages),
      error: () => this.studentsCount.set(0),
    });

    this.teacherApi.get(new TeacherFilterViewModel(1, 1)).subscribe({
      next: page => this.teachersCount.set(page.countPages),
      error: () => this.teachersCount.set(0),
    });

    this.staffApi.get(new AdministrativeStaffFilterViewModel(1, 1)).subscribe({
      next: page => this.staffCount.set(page.countPages),
      error: () => this.staffCount.set(0),
    });

    this.subjectApi.get(1, 1).subscribe({
      next: page => this.subjectsCount.set(page.countPages),
      error: () => this.subjectsCount.set(0),
    });

    this.assignmentApi.get(1, 1).subscribe({
      next: page => this.assignmentsCount.set(page.countPages),
      error: () => this.assignmentsCount.set(0),
    });

    this.loadGradeRows();
  }

  stageLabel(stage: number | null): PhrasesType | null {
    return stage === null ? null : STAGE_LABEL[stage] ?? null;
  }

  private loadGradeRows(): void {
    this.gradeRowsLoading.set(true);
    this.ageGroupApi.get('', 1, 100).subscribe({
      next: page => {
        const rows: GradeRow[] = page.content
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(g => ({ ageGroupId: g.id, name: g.name, studentCount: null, stage: null }));
        this.gradeRows.set(rows);
        this.gradeRowsLoading.set(false);
        rows.forEach(row => this.loadGradeStudentCount(row.ageGroupId));

        this.academicYearId$.pipe(filter((id): id is number => id !== null), take(1)).subscribe(academicYearId => {
          rows.forEach(row => this.loadGradeStage(row.ageGroupId, academicYearId));
        });
      },
      error: () => this.gradeRowsLoading.set(false),
    });
  }

  private loadGradeStudentCount(ageGroupId: number): void {
    this.studentApi.get(new StudentFilterViewModel(1, 1, undefined, undefined, { id: ageGroupId } as AgeGroupModel)).subscribe({
      next: page => this.patchGradeRow(ageGroupId, { studentCount: page.countPages }),
      error: () => this.patchGradeRow(ageGroupId, { studentCount: 0 }),
    });
  }

  private loadGradeStage(ageGroupId: number, academicYearId: number): void {
    this.resultsApi.getPipeline(academicYearId, ageGroupId, null).subscribe({
      next: p => this.patchGradeRow(ageGroupId, { stage: p.stage }),
      error: () => this.patchGradeRow(ageGroupId, { stage: null }),
    });
  }

  private patchGradeRow(ageGroupId: number, patch: Partial<GradeRow>): void {
    this.gradeRows.update(rows => rows.map(r => (r.ageGroupId === ageGroupId ? { ...r, ...patch } : r)));
  }
}
