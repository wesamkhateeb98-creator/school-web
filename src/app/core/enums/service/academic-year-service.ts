import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";
import { AcademicYearStatus } from "../academic-year-status";

@Injectable({
  providedIn: 'root',
})

export class AcademicYearService {

  private language = inject(Language);

  academicYears: { id: number; name: string }[];

  constructor() {
    this.academicYears = [
      { id: AcademicYearStatus.Started, name: this.language.transform('started') },
      { id: AcademicYearStatus.Ended, name: this.language.transform('ended') }
    ];
  }

  getAcademicYearStatus(status: AcademicYearStatus) {
    return this.academicYears.find(p => p.id === status)?.name ?? null;
  }
}


