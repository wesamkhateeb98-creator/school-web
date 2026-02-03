import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class StudentAttendanceFilterTypeService {

  private language = inject(Language);

  attendances: { id: number; name: string }[];

  constructor() {
    this.attendances = [
      { id: 0, name: this.language.transform('all_title') },
      { id: 1, name: this.language.transform('present_title') },           // حضور
      { id: 2, name: this.language.transform('excused_absence_title') },   // غياب مبرر
      { id: 3, name: this.language.transform('unexcused_absence_title') }, // غياب غير مبرر
      { id: 4, name: this.language.transform('excused_late_title') },      // تأخير مبرر
      { id: 5, name: this.language.transform('unexcused_late_title') },    // تأخير غير مبرر
      { id: 6, name: this.language.transform('excused_leave_title') },     // خروج مبرر
      { id: 7, name: this.language.transform('unexcused_leave_title') },   // خروج غير مبرر
      { id: 8, name: this.language.transform('expelled_title') }           // مفصول
    ];
  }

  getAttendancesById(id: number) {
    return this.attendances.find(p => p.id === id) ?? null;
  }
}


