import { Routes } from '@angular/router';
import { messageTitle } from '../../core/consts';
import { StaffLayout } from './staff-layout/staff-layout';
import { StudentMarkSheetPage } from '../manager/pages/student-mark-sheet/student-mark-sheet';
import { SubjectMarkPage } from '../manager/pages/subject-mark/subject-mark';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    component: StaffLayout,
    children: [
      {
        path: 'student-mark-sheet',
        component: StudentMarkSheetPage,
        title: messageTitle('student_mark_sheet_title'),
      },
      {
        path: 'subject-mark-sheed/:markSheetId/subjectAgeGroupId/:subjectAgeGroupId',
        component: SubjectMarkPage,
        title: messageTitle('student_mark_title'),
      },
      { path: '',   redirectTo: 'student-mark-sheet', pathMatch: 'full' },
      { path: '**', redirectTo: 'student-mark-sheet', pathMatch: 'full' },
    ],
  },
];
