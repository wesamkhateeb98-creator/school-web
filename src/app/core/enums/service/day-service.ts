import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class DayService {

  private language = inject(Language);

  days: { id: number; name: string }[];

  constructor() {
    this.days = [
      { id: 1, name: this.language.transform('saturday_title') },
      { id: 2, name: this.language.transform('sunday_title') },
      { id: 3, name: this.language.transform('monday_title') },
      { id: 4, name: this.language.transform('tuesday_title') },
      { id: 5, name: this.language.transform('wednesday_title') },
      { id: 6, name: this.language.transform('thursday_title') },
      { id: 7, name: this.language.transform('friday_title') },
    ];
  }

  getDaysById(id: number) {
    return this.days.find(p => p.id === id) ?? null;
  }
}


