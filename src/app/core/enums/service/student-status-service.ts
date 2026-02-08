import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class StudentStatusService {

  private language = inject(Language);

  statuses: { id: number; name: string }[];


  constructor() {
    this.statuses = [
      { id: 0, name: this.language.transform('student_status_new') },
      { id: 1, name: this.language.transform('student_status_transferred') },
      { id: 2, name: this.language.transform('student_status_graduated') },
      { id: 3, name: this.language.transform('student_status_expelled') }
    ];
  }

  getForRegister() {
    return [
      this.statuses[0],
      this.statuses[1]
    ];
  }

  getById(id: number) {
    return this.statuses.find(p => p.id === id) ?? null;
  }
}


