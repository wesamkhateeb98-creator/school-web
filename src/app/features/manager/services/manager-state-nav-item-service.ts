import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../view-model/NavItemViewModel';

@Injectable({
  providedIn: 'root',
})
export class ManagerNavItemStateService {
  
  navItems: NavItemViewModel[] = [
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
      url:"/manager/age-group",
      name:"age_group_title",
      icon:"group",
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
          isExpended:false,
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
              isExpended:false,
              subItem:[{
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
        },  ]
            },  
          ]
        },  
      ],
      isExpended:false
    }
  ];

}
