export enum StaffPermission {
  // Mark Entry (28-31)
  AddSubjectMarkEntry     = 28,
  UpdateSubjectMarkEntry  = 29,
  DeleteSubjectMarkEntry  = 30,
  GetSubjectMarkEntry     = 31,

  // Mark Sheets (32-36)
  AddSubjectMarkSheet     = 32,
  UpdateSubjectMarkSheet  = 33,
  DeleteSubjectMarkSheet  = 34,
  GetSubjectMarkSheet     = 35,
  ConfirmSubjectMarkSheet = 36,

  // Assignment Evaluations (37-40)
  AddStudentAssignmentEvaluation    = 37,
  UpdateStudentAssignmentEvaluation = 38,
  DeleteStudentAssignmentEvaluation = 39,
  GetStudentAssignmentEvaluation    = 40,

  // Results & Promotion (41-47)
  GenerateResults      = 41,
  ViewResults           = 42,
  DecideStudentStatus   = 43,
  PublishResults        = 44,
  PromoteStudent        = 45,
  ViewTransferLog       = 46,
  ReopenMarkSheet       = 47,
}
