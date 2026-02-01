import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class StudentAttendanceTypeService {

  private language = inject(Language);

  attendance: { id: number; name: string }[];

  constructor() {
    this.attendance = [
      { id: 1, name: this.language.transform('presence_title') },
      { id: 2, name: this.language.transform('late_title') },
      { id: 3, name: this.language.transform('absence_title') },
      { id: 4, name: this.language.transform('escaped_title') },
      { id: 5, name: this.language.transform('excused_title') },
      { id: 6, name: this.language.transform('expelled_title') },
    ];
  }

  getAttendanceById(id: number) {
    return this.attendance.find(p => p.id === id) ?? null;
  }
}


