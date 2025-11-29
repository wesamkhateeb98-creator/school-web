import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../../shared/model/NavItemViewModel';

@Injectable({
  providedIn: 'root',
})
export class ManagerNavItemStateService {
  
  navItems: NavItemViewModel[] = [
    {
      url:"",
      name:"registrations_title",
      icon:"app_registration",
      subItem:[
        {
          url:"/manager/members",
          name:"academic_year_title",
          icon:"date_range",
          isExpended:false
        },
        {
          url:"/manager/age-group",
          name:"age_group_title",
          icon:"group",
          isExpended:false
        },
        {
          url:"/manager/semster",
          name:"semester_title",
          icon:"date_range",
          isExpended:false
        }
      ],
      isExpended:false
    }
  ];

}
