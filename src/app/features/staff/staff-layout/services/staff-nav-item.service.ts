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
        url: '/manager/mark-entry',
        name: 'mark_sheets_list_title',
        icon: 'grading',
        isExpended: false,
      });
      items.push({
        url: '/manager/mark-entry/matrix',
        name: 'mark_sheet_matrix_title',
        icon: 'grid_view',
        isExpended: false,
      });
    }

    return items;
  });
}
