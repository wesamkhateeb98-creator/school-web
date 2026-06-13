import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { ClassModel } from './models/class/class-model';
import { ClassScheduleDayModel } from './models/schedule-class/add-schedule-class-model';
import { ScheduleClassModel } from './models/schedule-class/schedule-class-model';
import { AddClassViewModel } from '../../pages/classes-page/view-model/add-class-view-model';
import { ClassFilterViewModel } from '../../pages/classes-page/view-model/class-filter-view-model';
import { ClassByIdModel } from './models/class/class-by-id-model';

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
            AgeGroupId: filter.ageGroup?.id,
            AcademicYearId: filter.academicYear?.id,
            PageNumber: filter.pageNumber,
            PageSize: filter.pageSize
        });
    }

    getByOpenAcademicYear(pageNumber:number, pageSize:number, ageGroupId?:number): Observable<Page<ClassModel>> {
        return this.http.get<Page<ClassModel>>('class/open-academic-year', {
            AgeGroupId: ageGroupId,
            PageNumber: pageNumber,
            PageSize: pageSize
        });
    }

    getByAccountIdYear(pageNumber:number, pageSize:number, accountId:number): Observable<Page<ClassModel>> {
        return this.http.get<Page<ClassModel>>(`class/management/account/${accountId}`, {
            PageNumber: pageNumber,
            PageSize: pageSize
        });
    }

    delete(id: number): Observable<MutateResponse> {
        return this.http.delete<MutateResponse>(`${this.baseUrl}/${id}`);
    }

    addScheduleClass(key: string, classId: number,day: number, subjectsInSchedule: ClassScheduleDayModel[]): Observable<void> {
        return this.http.post(`${this.baseUrl}/${classId}/class-schedule`, {
            key: key,
            day: day,
            classScheduleDay: subjectsInSchedule
        });
    }

    updateScheduleClass(
        classId: number,
        classScheduleId: number,
        subjectId: number,
        day: number,
        periodId: number,
        assignAll:boolean,
        teacherId: (number| undefined),
    ): Observable<MutateResponse> {
        return this.http.put<MutateResponse>(`${this.baseUrl}/${classId}/class-schedule/${classScheduleId}`, {
            subjectId: subjectId,
            day: day,
            periodId: periodId,
            teacherId: teacherId,
            assignAll: assignAll
        });
    }

    getScheduleClass(
        id : number,
        day: number|undefined = undefined,
        subjectId: number|undefined = undefined,
        periodId: number|undefined = undefined,
        teacherId: number|undefined = undefined
    ): Observable<ScheduleClassModel> {
        return this.http.get<ScheduleClassModel>(`${this.baseUrl}/management/${id}/class-schedule`, {
            day: day,
            subjectId: subjectId,
            periodId: periodId,
            teacherId: teacherId
        });
    }

    deleteScheduleClass(
        classId: number,
        classScheduleId: number,): Observable<MutateResponse> {
        return this.http.delete<MutateResponse>(`${this.baseUrl}/${classId}/class-schedule/${classScheduleId}`);
    }

    getByIdClassForAdmin(
        id : number
    ): Observable<ClassByIdModel> {
        return this.http.get<ClassByIdModel>(`${this.baseUrl}/${id}/admin`);
    }

    getStudentsByClassId(classId: number, name: string | null, pageNumber: number, pageSize: number): Observable<Page<{ id: number; name: string }>> {
        return this.http.get<Page<{ id: number; name: string }>>(`${this.baseUrl}/${classId}/students`, {
            name,
            pageNumber,
            pageSize,
        });
    }
}