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
      { id: 1, name: this.language.transform('get_student_note_permission') },
      { id: 2, name: this.language.transform('add_student_note_permission') },
      { id: 3, name: this.language.transform('update_student_note_permission') },
      { id: 4, name: this.language.transform('delete_student_note_permission') },

      { id: 5, name: this.language.transform('get_point_permission') },
      { id: 6, name: this.language.transform('add_point_permission') },
      { id: 7, name: this.language.transform('update_point_permission') },
      { id: 8, name: this.language.transform('delete_point_permission') },

      { id: 9, name: this.language.transform('release_student_note_to_parent_permission') },
      { id: 10, name: this.language.transform('solve_student_note_permission') },

      { id: 11, name: this.language.transform('get_student_attendance_permission') },
      { id: 12, name: this.language.transform('add_student_attendance_permission') },
      { id: 13, name: this.language.transform('update_student_attendance_permission') },
      { id: 14, name: this.language.transform('delete_student_attendance_permission') },
      { id: 15, name: this.language.transform('release_student_attendance_to_parent_permission') },
      { id: 16, name: this.language.transform('solve_student_attendance_permission') },

      { id: 17, name: this.language.transform('expel_student_permission') },

      { id: 18, name: this.language.transform('get_parent_visit_history_permission') },
      { id: 19, name: this.language.transform('add_parent_visit_history_permission') },
      { id: 20, name: this.language.transform('update_parent_visit_history_permission') },
      { id: 21, name: this.language.transform('delete_parent_visit_history_permission') },
      { id: 22, name: this.language.transform('confirm_parent_visit_permission') }
    ];
  }

  getPermissionById(id: number) {
    return this.permissions.find(p => p.id === id) ?? null;
  }
}


