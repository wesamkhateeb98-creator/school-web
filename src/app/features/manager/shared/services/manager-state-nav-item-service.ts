import { Injectable } from '@angular/core';
import { NavItemViewModel } from '../../../shared/model/NavItemViewModel';

@Injectable({
  providedIn: 'root',
})
export class ManagerNavItemStateService {
  
  navItems: NavItemViewModel[] = [
    {
      url:"/manager/dashboard",
      name:"dashboard",
      icon:"dashboard",
      isExpended:false
    },
    {
      url:"/manager/classes",
      name:"classes_title",
      icon:"door_sliding",
      isExpended:false
    },
    {
      url:"/manager/assignments",
      name:"assignments_title",
      icon:"assignment",
      isExpended:false
    },
    {
      icon: 'person',
      name: 'user_title',
      isExpended: false,
      subItem: [
        {
          url: '/manager/students',
          name: 'students_title',
          icon: 'escalator_warning',
          isExpended: false
        },
        {
          url: '/manager/teachers',
          name: 'teachers_title',
          icon: 'school',
          isExpended: false
        },
        {
          url: '/manager/managerial',
          name: 'managerial_title',
          icon: 'manage_accounts',
          isExpended: false
        },
      ]
    },
    {
      icon: 'date_range',
      name: 'academic_year_title',
      isExpended: false,
      subItem: [
        {
          url: '/manager/academic-year',
          name: 'academic_year_title',
          icon: 'calendar_today',
          isExpended: false
        },
        {
          url: '/manager/semster',
          name: 'semester_title',
          icon: 'event_note',
          isExpended: false
        },
      ]
    },
    {
      icon: 'menu_book',
      name: 'subject_title',
      isExpended: false,
      subItem: [
        {
          url: '/manager/subjects',
          name: 'subject_title',
          icon: 'menu_book',
          isExpended: false
        },
        {
          url: '/manager/age-group',
          name: 'age_group_title',
          icon: 'groups',
          isExpended: false
        },
      ]
    },
    {
      icon: 'fact_check',
      name: 'results_promotion_group_title',
      isExpended: false,
      subItem: [
        {
          url: '/manager/results',
          name: 'results_center_title',
          icon: 'fact_check',
          isExpended: false
        },
        {
          url: '/manager/results/students',
          name: 'results_students_title',
          icon: 'groups_3',
          isExpended: false
        },
      ]
    },

  ];

}
