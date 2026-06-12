import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class PermissionService {

  private language = inject(Language);

  permissions: { id: number; name: string }[];

  constructor() {
    this.permissions = [
      // Student Notes (1-4)
      { id: 1,  name: this.language.transform('get_student_note_permission') },
      { id: 2,  name: this.language.transform('add_student_note_permission') },
      { id: 3,  name: this.language.transform('update_student_note_permission') },
      { id: 4,  name: this.language.transform('delete_student_note_permission') },

      // Points (5-9)
      { id: 5,  name: this.language.transform('get_point_permission') },
      { id: 6,  name: this.language.transform('add_point_permission') },
      { id: 7,  name: this.language.transform('update_point_permission') },
      { id: 8,  name: this.language.transform('delete_point_permission') },
      { id: 9,  name: this.language.transform('consume_points_permission') },

      // Student Notes Actions (10-11)
      { id: 10, name: this.language.transform('release_student_note_to_parent_permission') },
      { id: 11, name: this.language.transform('solve_student_note_permission') },

      // Student Attendance (12-17)
      { id: 12, name: this.language.transform('get_student_attendance_permission') },
      { id: 13, name: this.language.transform('add_student_attendance_permission') },
      { id: 14, name: this.language.transform('update_student_attendance_permission') },
      { id: 15, name: this.language.transform('delete_student_attendance_permission') },
      { id: 16, name: this.language.transform('release_student_attendance_to_parent_permission') },
      { id: 17, name: this.language.transform('solve_student_attendance_permission') },

      // Student Actions (18)
      { id: 18, name: this.language.transform('expel_student_permission') },

      // Parent Visits (19-23)
      { id: 19, name: this.language.transform('get_parent_visit_history_permission') },
      { id: 20, name: this.language.transform('add_parent_visit_history_permission') },
      { id: 21, name: this.language.transform('update_parent_visit_history_permission') },
      { id: 22, name: this.language.transform('delete_parent_visit_history_permission') },
      { id: 23, name: this.language.transform('confirm_parent_visit_permission') },

      // Assignments (24-27)
      { id: 24, name: this.language.transform('add_assignment_permission') },
      { id: 25, name: this.language.transform('update_assignment_permission') },
      { id: 26, name: this.language.transform('delete_assignment_permission') },
      { id: 27, name: this.language.transform('get_assignment_permission') },

      // Mark Entry (28-31)
      { id: 28, name: this.language.transform('add_mark_entry_permission') },
      { id: 29, name: this.language.transform('update_mark_entry_permission') },
      { id: 30, name: this.language.transform('delete_mark_entry_permission') },
      { id: 31, name: this.language.transform('get_mark_entry_permission') },

      // Mark Sheets (32-36)
      { id: 32, name: this.language.transform('add_mark_sheet_permission') },
      { id: 33, name: this.language.transform('update_mark_sheet_permission') },
      { id: 34, name: this.language.transform('delete_mark_sheet_permission') },
      { id: 35, name: this.language.transform('get_mark_sheet_permission') },
      { id: 36, name: this.language.transform('confirm_mark_sheet_permission') },

      // Assignment Evaluations (37-40)
      { id: 37, name: this.language.transform('add_student_assignment_evaluation_permission') },
      { id: 38, name: this.language.transform('update_student_assignment_evaluation_permission') },
      { id: 39, name: this.language.transform('delete_student_assignment_evaluation_permission') },
      { id: 40, name: this.language.transform('get_student_assignment_evaluation_permission') },
    ];
  }

  getPermissionById(id: number) {
    return this.permissions.find(p => p.id === id) ?? null;
  }
}
