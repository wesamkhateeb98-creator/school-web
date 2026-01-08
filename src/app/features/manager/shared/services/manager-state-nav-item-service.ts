import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../../../shared/model/NavItemViewModel';

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
        },
        {
          url:"/manager/classes",
          name:"classes_title",
          icon:"door_sliding",
          isExpended:false
        },
        {
          url:"/manager/subjects",
          name:"subject_title",
          icon:"subject",
          isExpended:false
        }
      ],
      isExpended:false
    },
    {
      icon: "person",
      name: 'user_title',
      isExpended:false,
      subItem:[
        {
          url:"/manager/users/students",
          name:"students_title",
          icon:"escalator_warning",
          isExpended:false
        },
        {
          url:"/manager/users/teachers",
          name:"teachers_title",
          icon:"contacts_product",
          isExpended:false
        },
        {
          url:"/manager/users/managerial",
          name:"managerial_title",
          icon:"manage_accounts",
          isExpended:false
        },
        
      ]
    }
  ];

}
