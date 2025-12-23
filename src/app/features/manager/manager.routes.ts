import { Routes } from "@angular/router";
import { DashboardLayout } from "./manager-layout/manager-layout";
import { AcademicYear } from "./pages/academic-year/academic-year";
import { Semester } from "./pages/semester/semester";
import { messageTitle } from "../../core/consts";
import { AgeGroup } from "./pages/age-group/age-group";
import { SubjectPage } from "./pages/subject/subject";
import { StudentsPage } from "./pages/student-page/students-page";
import { TeacherPage } from "./pages/teacher-page/teacher-page";
import { ManagerialPage } from "./pages/administrative-staff-page/administrative-staff-page";
import { ClassPage } from "./pages/class-page/class-page";

export const DASHBOARD_ROUTES: Routes = [
  {
    path:"",
    component: DashboardLayout, 
    children: [
      { 
        path:'academic_year', 
        component: AcademicYear, 
        title: messageTitle('academic_year_title')
      },
      { 
        path:'semster', 
        component: Semester, 
        title: messageTitle('semester_title')
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
      { 
        path: 'users', 
        children:[
          { path:'students', component: StudentsPage, title: messageTitle('students_title')},
          { path:'teachers', component: TeacherPage, title: messageTitle('teachers_title')},
          { path:'managerial', component: ManagerialPage, title: messageTitle('managerial_title')},
        ],
      },
      { 
        path:'classes', 
        component: ClassPage, 
        title: messageTitle('classes_title')
      },
      { path: '', redirectTo: 'academic_year', pathMatch: 'full' },
      { path: '**', redirectTo: 'academic_year', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
