import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { AddClassViewModel } from '../pages/class-page/view-model/add-class-view-model';
import { ClassModel } from './models/class/class-model';
import { ClassFilterViewModel } from '../pages/class-page/view-model/class-filter-view-model';

@Injectable({
    providedIn: 'root',
})
export class ClassEndpoints {
    private readonly baseUrl = 'Class';

    constructor(public http: HttpHelper) {}

    add(key: string, addModel: AddClassViewModel): Observable<MutateResponse> {
        
        return this.http.post<MutateResponse>(this.baseUrl, {
            key: key,
            ageGroupId: addModel.ageGroupId,
            academicYearId: addModel.academicYearId,
            section: addModel.section
        });
    }

    update(classId: number, updateModel: AddClassViewModel): Observable<MutateResponse> {
        return this.http.put<MutateResponse>(`${this.baseUrl}/${classId}`, {
            id: classId,
            ageGroupId: updateModel.ageGroupId,
            academicYearId: updateModel.academicYearId,
            section: updateModel.section
        });
    }

    get(filter: ClassFilterViewModel): Observable<Page<ClassModel>> {
        return this.http.get<Page<ClassModel>>(this.baseUrl, {
            AgeGroupId: filter.ageGroupId,
            AcademicYearId: filter.academicYearId,
            PageNumber: filter.pageNumber,
            PageSize: filter.pageSize
        });
    }

    delete(id: number): Observable<MutateResponse> {
        return this.http.delete<MutateResponse>(`${this.baseUrl}/${id}`);
}
}