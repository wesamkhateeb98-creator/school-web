import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class SeverityService {

  private language = inject(Language);

  severity: { id: number; name: string }[];

  constructor() {
    this.severity = [
      { id: 1, name: this.language.transform('low_title') },
      { id: 2, name: this.language.transform('middle_title') },
      { id: 3, name: this.language.transform('high_title') }
    ];
  }

  getSeverityById(id: number) {
    return this.severity.find(p => p.id === id) ?? null;
  }
}


