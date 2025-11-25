import { Routes } from "@angular/router";
import { DashboardLayout } from "./manager-layout/manager-layout";
import { AcademicYear } from "./pages/academic-year/academic-year";
import { Semester } from "./pages/semester/semester";
import { messageTitle } from "../../core/consts";
import { AgeGroup } from "./pages/age-group/age-group";
import { SubjectPage } from "./pages/subject/subject";

export const DASHBOARD_ROUTES: Routes = [
  {
    path:"",
    component: DashboardLayout, 
    children: [
      { 
        path: 'academic_year', 
        children:[
          { path:'', component: AcademicYear, title: messageTitle('academic_year_title')},
          { 
            path:':id/semester', 
            component: Semester, 
            title: messageTitle('semester_title')
          },
        ],
      },
      { 
        path: 'age-group', 
        children:[
          { path:'', component: AgeGroup, title: messageTitle('age_group_title')},
          { 
            path:':id/subject', 
            component: SubjectPage, 
            title: messageTitle('subject_title')
          },
        ],
      },
      { path: '', redirectTo: 'academic_year', pathMatch: 'full' },
      { path: '**', redirectTo: 'academic_year', pathMatch: 'full' },
    ],
  },
];
