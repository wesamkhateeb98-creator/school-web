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
      { id: AcademicYearStatus.Active, name: this.language.transform('active') },
      { id: AcademicYearStatus.Deactive, name: this.language.transform('deactive') }
    ];
  }

  getAcademicYearStatus(status: AcademicYearStatus) {
    return this.academicYears.find(p => p.id === status)?.name ?? null;
  }
}


