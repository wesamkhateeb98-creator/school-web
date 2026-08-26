import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Language } from '../../../../core/services/language';
import { PhrasesType } from '../../../../core/resource/phrases';
import { StudentEndpoints } from '../../shared/endpoints/student-endpoint';
import { TeacherEndpoints } from '../../shared/endpoints/teacher-endpoint';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { SubjectEndpoints } from '../../shared/endpoints/subject-endpoint';
import { StudentFilterViewModel } from '../student-page/view-model/student-filter-view-model';
import { TeacherFilterViewModel } from '../teacher-page/view-model/teacher-filter-view-model';

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
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, MatRippleModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  language = inject(Language);

  private studentApi = inject(StudentEndpoints);
  private teacherApi = inject(TeacherEndpoints);
  private classApi = inject(ClassEndpoints);
  private subjectApi = inject(SubjectEndpoints);

  studentsCount = signal<number | null>(null);
  teachersCount = signal<number | null>(null);
  classesCount = signal<number | null>(null);
  subjectsCount = signal<number | null>(null);

  today = new Intl.DateTimeFormat(this.language.getLanguageCode(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  total = computed(() =>
    (this.studentsCount() ?? 0) +
    (this.teachersCount() ?? 0) +
    (this.classesCount() ?? 0) +
    (this.subjectsCount() ?? 0)
  );

  stats = computed<StatCard[]>(() => {
    const total = this.total();
    const percentOf = (value: number | null) => (total ? Math.round(((value ?? 0) / total) * 100) : 0);

    return [
      { key: 'students_title', icon: 'escalator_warning', color: 'var(--mat-sys-primary)', url: '/manager/students', value: this.studentsCount(), percent: percentOf(this.studentsCount()) },
      { key: 'teachers_title', icon: 'school', color: 'var(--mat-sys-tertiary)', url: '/manager/teachers', value: this.teachersCount(), percent: percentOf(this.teachersCount()) },
      { key: 'classes_title', icon: 'door_sliding', color: 'var(--mat-sys-secondary)', url: '/manager/classes', value: this.classesCount(), percent: percentOf(this.classesCount()) },
      { key: 'subject_title', icon: 'menu_book', color: 'var(--gold-500)', url: '/manager/subjects', value: this.subjectsCount(), percent: percentOf(this.subjectsCount()) },
    ];
  });

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

    this.classApi.getByOpenAcademicYear(1, 1).subscribe({
      next: page => this.classesCount.set(page.countPages),
      error: () => this.classesCount.set(0),
    });

    this.subjectApi.get(1, 1).subscribe({
      next: page => this.subjectsCount.set(page.countPages),
      error: () => this.subjectsCount.set(0),
    });
  }
}
