import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../view-model/NavItemViewModel';

@Injectable({
  providedIn: 'root',
})
export class ManagerNavItemStateService {
  
  navItems: NavItemViewModel[] = [
    {
      url:"/manager/members",
      isSelected:false,
      name:"academic_year_title",
      icon:"date_range"
    },
    {
      url:"/manager/age-group",
      isSelected:false,
      name:"age_group_title",
      icon:"group"
    }
  ];

  selectItem(selectedItem: NavItemViewModel): void {
    this.navItems.forEach(item => item.isSelected = false);
    selectedItem.isSelected = true;
  }
}
