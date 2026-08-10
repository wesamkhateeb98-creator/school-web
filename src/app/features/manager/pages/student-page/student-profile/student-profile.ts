import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Language } from '../../../../../core/services/language';
import { StudentNotesPage } from '../../student-notes/student-notes';
import { StudentPointsPage } from '../../student-points/student-points';
import { StudentattendancePage } from '../../student-attendance/student-attendance';
import { StudentParentVisitHistory } from '../../student-parent-visit-history/student-parent-visit-history';

@Component({
  selector: 'app-student-profile',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatTooltip,
    StudentNotesPage,
    StudentPointsPage,
    StudentattendancePage,
    StudentParentVisitHistory,
  ],
  templateUrl: './student-profile.html',
})
export class StudentProfilePage {
  language = inject(Language);
  private router = inject(Router);

  goBack(): void {
    this.router.navigate(['manager/students']);
  }
}
