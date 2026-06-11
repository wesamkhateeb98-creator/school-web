import { Routes } from "@angular/router";
import { messageTitle } from "../../core/consts";
import { adminMatchGuard } from "../../core/guard/admin-match.guard";
import { staffMatchGuard } from "../../core/guard/staff-match.guard";
import { staffPermissionGuard } from "../../core/guard/staff-permission.guard";
import { StaffPermission } from "../../core/enums/staff-permission.enum";

// ── Admin layout ──────────────────────────────────────────────────────────
import { DashboardLayout } from "./manager-layout/manager-layout";
import { DashboardPage } from "./pages/dashboard/dashboard";
import { AcademicYear } from "./pages/academic-year/academic-year";
import { Semester } from "./pages/semester/semester";
import { AgeGroup } from "./pages/age-group/age-group";
import { SubjectPage } from "./pages/subject/subject";
import { StudentsPage } from "./pages/student-page/students-page";
import { TeacherPage } from "./pages/teacher-page/teacher-page";
import { ManagerialPage } from "./pages/administrative-staff-page/administrative-staff-page";
import { PeriodPage } from "./pages/period/period";
import { ClassSchedulePage } from "./pages/class-schedule/class-schedule";
import { StudyPlan } from "./pages/study-plan/study-plan";
import { AgeGroupSubject } from "./pages/age-group-subject/age-group-subject";
import { ClassStudent } from "./pages/class-student/class-student";
import { ClassesPage } from "./pages/classes-page/classes-page";
import { ClassInfoPage } from "./pages/class-info-page/class-info-page";
import { StudentNotesPage } from "./pages/student-notes/student-notes";
import { StudentPointsPage } from "./pages/student-points/student-points";
import { StudentattendancePage as StudentAttendancePage } from "./pages/student-attendance/student-attendance";
import { StudentParentVisitHistory } from "./pages/student-parent-visit-history/student-parent-visit-history";
import { AssignmentsPage } from "./pages/assignments/assignments-page";
import { AssignmentDetailPage } from "./pages/assignments/assignment-detail-page/assignment-detail-page";
import { StudentAssignmentsPage } from "./pages/student-assignments-page/student-assignments-page";
import { SubjectMarkDistributionPage } from "./pages/subject-mark-distribution/subject-mark-distribution";
import { StudentMarkSheetPage } from "./pages/student-mark-sheet/student-mark-sheet";
import { SubjectMarkPage } from "./pages/subject-mark/subject-mark";

// ── Staff layout ──────────────────────────────────────────────────────────
import { StaffLayout } from "../staff/staff-layout/staff-layout";

export const DASHBOARD_ROUTES: Routes = [

  // ── Admin (role = 3) ────────────────────────────────────────────────────
  {
    path: '',
    canMatch: [adminMatchGuard],
    component: DashboardLayout,
    children: [
      { path: 'academic-year', component: AcademicYear, title: messageTitle('academic_year_title') },
      { path: 'semster',       component: Semester,     title: messageTitle('semester_title') },
      {
        path: 'age-group',
        children: [
          { path: '',                                        component: AgeGroup,                   title: messageTitle('age_group_title') },
          { path: ':ageGroupId/subject',                     component: AgeGroupSubject,             title: messageTitle('subjects_age_group') },
          { path: ':ageGroupId/subject/:subject/study-plan', component: StudyPlan,                  title: messageTitle('study_plan_title') },
          { path: ':ageGroupId/subject/:subject/mark-distribution', component: SubjectMarkDistributionPage, title: messageTitle('mark_distribution_title') },
        ],
      },
      { path: 'subjects',  component: SubjectPage,  title: messageTitle('subject_title') },
      { path: 'teachers',  component: TeacherPage,  title: messageTitle('teachers_title') },
      { path: 'managerial', component: ManagerialPage, title: messageTitle('managerial_title') },
      {
        path: 'assignments',
        children: [
          { path: '',    component: AssignmentsPage,     title: messageTitle('assignments_title') },
          { path: ':id', component: AssignmentDetailPage, title: messageTitle('assignments_title') },
        ],
      },
      {
        path: 'students',
        children: [{ path: '', component: StudentsPage, title: messageTitle('students_title') }],
      },
      {
        path: 'student',
        children: [
          { path: ':id/student-notes',     component: StudentNotesPage,         title: messageTitle('notes') },
          { path: ':id/student-points',    component: StudentPointsPage,        title: messageTitle('points') },
          { path: ':id/student-attendance', component: StudentAttendancePage,   title: messageTitle('attendances') },
          { path: ':id/student-parent-visits', component: StudentParentVisitHistory, title: messageTitle('student_parent_visits') },
        ],
      },
      {
        path: 'classes',
        children: [
          { path: '',           component: ClassesPage, title: messageTitle('classes_title') },
          { path: ':id/students', component: ClassStudent, title: messageTitle('students_title') },
        ],
      },
      {
        path: 'class',
        children: [
          { path: ':id/info',                                    component: ClassInfoPage,            title: messageTitle('class_title') },
          { path: ':id/students',                                component: ClassStudent,             title: messageTitle('class_title') },
          { path: ':id/class-schedules',                         component: ClassSchedulePage,        title: messageTitle('class_schedules_title') },
          { path: ':classId/student/:id/student-notes',          component: StudentNotesPage,         title: messageTitle('notes') },
          { path: ':classId/student/:id/student-points',         component: StudentPointsPage,        title: messageTitle('points') },
          { path: ':classId/student/:id/student-attendances',    component: StudentAttendancePage,    title: messageTitle('attendances') },
          { path: ':classId/student/:id/student-parent-visits',  component: StudentParentVisitHistory, title: messageTitle('student_parent_visits') },
          { path: ':classId/student/:id/assignments',            component: StudentAssignmentsPage,   title: messageTitle('assignments_title') },
          { path: 'periods', component: PeriodPage, title: messageTitle('periods_title') },
        ],
      },
      { path: 'student-mark-sheet', component: StudentMarkSheetPage, title: messageTitle('student_mark_sheet_title') },
      { path: 'subject-mark-sheed/:markSheetId/subjectAgeGroupId/:subjectAgeGroupId', component: SubjectMarkPage, title: messageTitle('student_mark_title') },
      { path: 'dashboard', component: DashboardPage, title: messageTitle('dashboard') },
      { path: '',   redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ── Administrative Staff (role = 2) ─────────────────────────────────────
  {
    path: '',
    canMatch: [staffMatchGuard],
    component: StaffLayout,
    children: [
      {
        path: 'student-mark-sheet',
        component: StudentMarkSheetPage,
        title: messageTitle('student_mark_sheet_title'),
        canActivate: [staffPermissionGuard(StaffPermission.GetSubjectMarkSheet)],
      },
      {
        path: 'subject-mark-sheed/:markSheetId/subjectAgeGroupId/:subjectAgeGroupId',
        component: SubjectMarkPage,
        title: messageTitle('student_mark_title'),
        canActivate: [staffPermissionGuard(StaffPermission.GetSubjectMarkEntry)],
      },
      { path: '',   redirectTo: 'student-mark-sheet', pathMatch: 'full' },
      { path: '**', redirectTo: 'student-mark-sheet', pathMatch: 'full' },
    ],
  },

];
