import { Routes } from "@angular/router";
import { Settings } from "./pages/settings/settings";
import { DashboardLayout } from "./manager-layout/manager-layout";
import { AcademicYear } from "./pages/academic-year/academic-year";
import { Language } from "../../core/services/language";
import { inject } from "@angular/core";
import { PhrasesType } from "../../core/resource/phrases";
import { Semester } from "./pages/semester/semester";
import { messageTitle } from "../../core/consts";

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
      { path: 'settings', component: Settings, title: 'User Settings' },
      { path: '', redirectTo: 'academic_year', pathMatch: 'full' },
      { path: '**', redirectTo: 'academic_year', pathMatch: 'full' },
    ],
  },
];
