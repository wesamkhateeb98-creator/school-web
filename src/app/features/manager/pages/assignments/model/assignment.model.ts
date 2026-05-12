export enum AssignmentType {
  Homework = 0,
  Recitation = 1,
  Classroom_Activities = 2,
  Quiz = 3,
  Project = 4,
  Review = 5,
  Midterm_Review = 6,
  Final_Exam = 7,
  Other = 8,
}

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  [AssignmentType.Homework]: 'وظيفة',
  [AssignmentType.Recitation]: 'تسميع',
  [AssignmentType.Classroom_Activities]: 'أنشطة صفية',
  [AssignmentType.Quiz]: 'سبر',
  [AssignmentType.Project]: 'مشروع',
  [AssignmentType.Review]: 'مذاكرة',
  [AssignmentType.Midterm_Review]: 'امتحان نصفي',
  [AssignmentType.Final_Exam]: 'امتحان نهائي',
  [AssignmentType.Other]: 'غير ذلك',
};

export interface AssignmentClassInfo {
  id: number;
  name: string;
  section: number;
}

export interface AssignmentResponse {
  id: number;
  key: string;
  title: string;
  description: string | null;
  type: AssignmentType;
  assignmentAt: string;
  requiredTime: boolean;
  classInfo: AssignmentClassInfo | null;
  subjectAgeGroupId: number;
  subjectName: string;
  createdById: number;
  createdAt: string;
}

export interface AssignmentPayload {
  key: string;
  title: string;
  description?: string;
  type: AssignmentType;
  assignmentAt: string;
  requiredTime: boolean;
  classId?: number;
  subjectAgeGroupId: number;
  academicYearSemesterId: number;
}

export interface AssignmentUpdatePayload {
  title: string;
  description?: string;
  type: AssignmentType;
  assignmentAt: string;
  requiredTime: boolean;
  classId?: number;
  subjectAgeGroupId: number;
}
