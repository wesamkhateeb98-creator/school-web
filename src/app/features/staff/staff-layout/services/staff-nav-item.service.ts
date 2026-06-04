import { computed, inject, Injectable } from '@angular/core';
import { NavItemViewModel } from '../../../shared/model/NavItemViewModel';
import { StaffProfileService } from '../../services/staff-profile.service';
import { StaffPermission } from '../../../../core/enums/staff-permission.enum';

@Injectable({ providedIn: 'root' })
export class StaffNavItemService {
  private staffProfile = inject(StaffProfileService);

  navItems = computed<NavItemViewModel[]>(() => {
    const items: NavItemViewModel[] = [];

    if (this.staffProfile.hasPermission(StaffPermission.GetSubjectMarkSheet)) {
      items.push({
        url: '/manager/student-mark-sheet',
        name: 'student_mark_sheet_title',
        icon: 'grading',
        isExpended: false,
      });
    }

    return items;
  });
}
