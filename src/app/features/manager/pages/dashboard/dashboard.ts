import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Language } from '../../../../core/services/language';
import { PhrasesType } from '../../../../core/resource/phrases';

interface QuickLink {
  name: PhrasesType;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, MatRippleModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  language = inject(Language);

  quickLinks: QuickLink[] = [
    { name: 'classes_title',        icon: 'door_sliding',      url: '/manager/classes',            color: 'var(--mat-sys-primary)' },
    { name: 'assignments_title',    icon: 'assignment',        url: '/manager/assignments',        color: 'var(--mat-sys-tertiary)' },
    { name: 'student_mark_title',   icon: 'grading',           url: '/manager/student-mark-sheet', color: 'var(--mat-sys-secondary)' },
    { name: 'students_title',       icon: 'escalator_warning', url: '/manager/students',           color: 'var(--mat-sys-primary)' },
    { name: 'teachers_title',       icon: 'school',            url: '/manager/teachers',           color: 'var(--mat-sys-tertiary)' },
    { name: 'managerial_title',     icon: 'manage_accounts',   url: '/manager/managerial',         color: 'var(--mat-sys-secondary)' },
    { name: 'academic_year_title',  icon: 'calendar_today',    url: '/manager/academic-year',      color: 'var(--mat-sys-primary)' },
    { name: 'semester_title',       icon: 'event_note',        url: '/manager/semster',            color: 'var(--mat-sys-tertiary)' },
    { name: 'subject_title',        icon: 'menu_book',         url: '/manager/subjects',           color: 'var(--mat-sys-secondary)' },
    { name: 'age_group_title',      icon: 'groups',            url: '/manager/age-group',          color: 'var(--mat-sys-primary)' },
  ];
}
