import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../view-model/NavItemViewModel';

@Injectable({
  providedIn: 'root',
})
export class ManagerStateService {
  
  navItems: NavItemViewModel[] = [
    {
      url:"/manager/members",
      isSelected:false,
      name:"academic_year_title",
      icon:"person"
    },
    {
      url:"/manager/settings",
      isSelected:false,
      name:"settings",
      icon:"settings"
    }
  ];

  selectItem(selectedItem: NavItemViewModel): void {
    this.navItems.forEach(item => item.isSelected = false);
    selectedItem.isSelected = true;
  }
}
