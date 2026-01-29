import { inject, Injectable, signal } from "@angular/core";
import { AcademicYearEndpoints } from "../academic-year-endpoints";
import { SemesterEndpoints } from "../semester-endpoints";
import { errorMatSnackbarConfig } from "../../../../../core/consts";
import { Language } from "../../../../../core/services/language";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SemesterInOpenAcademicYear } from "../models/semester/semester-in-open-academic-year";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApiWhenLoading {
    semesterEndpoints = inject(SemesterEndpoints);
    language = inject(Language);
    matSnackBar = inject(MatSnackBar);

    semesterInOpenAcademicYear = signal<SemesterInOpenAcademicYear|undefined>(undefined);

    async semesterLoading(){
        if(this.semesterInOpenAcademicYear() == undefined){
            this.semesterInOpenAcademicYear.set(await firstValueFrom(this.semesterEndpoints.getSemesterForOpenAcademicYear()));
        }
    }
}