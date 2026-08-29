import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { Language } from '../../../../core/services/language';
import { PhrasesType } from '../../../../core/resource/phrases';
import { StudentEndpoints } from '../../shared/endpoints/student-endpoint';
import { TeacherEndpoints } from '../../shared/endpoints/teacher-endpoint';
import { AdministrativeStaffEndpoints } from '../../shared/endpoints/administrative-staff-endpoint';
import { SubjectEndpoints } from '../../shared/endpoints/subject-endpoint';
import { AssignmentEndpoints } from '../../shared/endpoints/assignment-endpoint';
import { StudentFilterViewModel } from '../student-page/view-model/student-filter-view-model';
import { TeacherFilterViewModel } from '../teacher-page/view-model/teacher-filter-view-model';
import { AdministrativeStaffFilterViewModel } from '../administrative-staff-page/view-model/administrative-staff-filter-view-model';

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

  studentsCount = signal<number | null>(null);
  teachersCount = signal<number | null>(null);
  staffCount = signal<number | null>(null);
  subjectsCount = signal<number | null>(null);
  assignmentsCount = signal<number | null>(null);

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
  }
}
