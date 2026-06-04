import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../../../shared/model/NavItemViewModel';

@Injectable({ providedIn: 'root' })
export class StaffNavItemService {
  navItems: NavItemViewModel[] = [
    {
      url: '/manager/student-mark-sheet',
      name: 'student_mark_sheet_title',
      icon: 'grading',
      isExpended: false,
    },
  ];
}
