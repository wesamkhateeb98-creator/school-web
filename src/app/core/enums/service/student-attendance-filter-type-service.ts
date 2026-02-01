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
      { id: 1, name: this.language.transform('presence_title') },
      { id: 2, name: this.language.transform('late_title') },
      { id: 3, name: this.language.transform('absence_title') },
      { id: 4, name: this.language.transform('escaped_title') },
      { id: 5, name: this.language.transform('excused_title') },
      { id: 6, name: this.language.transform('expelled_title') },
    ];
  }

  getAttendancesById(id: number) {
    return this.attendances.find(p => p.id === id) ?? null;
  }
}


