import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { AgeGroupModel } from './models/age-group/age-group-model';
import { SubjectViewModel } from '../../pages/subject/model/subject-view-model';
import { SubjectForAgeGroupModel } from './models/age-group/subject-for-age-group-model';
import { StudyPlanWeekModel, StudyPlanWeekRequest } from './models/subject/study-plan-week-model';

@Injectable({
  providedIn: 'root',
})
export class AgeGroupEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, name:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("age-group",{
      key:key,
      name:name,
    })
  }

  update(semesterId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("age-group/" + semesterId,{
      name:name
    })
  }

  get(name:string, selectedPage:number, pageSize:number):Observable<Page<AgeGroupModel>>{
    return this.http.get<Page<AgeGroupModel>>('age-group/',{
        Name: name,
        PageNumber: selectedPage,
        PageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>("age-group/"+id);
  }

  addSubject(id:number, subjectId:number, maxGrade:number, minPassGrade:number): Observable<MutateResponse>{
    return this.http.post<MutateResponse>(`age-group/${id}/subject`,{
      subjectId,
      maxGrade,
      minPassGrade
    });
  }

  updateSubject(ageGroupId:number, subjectAgeGroupId:number, maxGrade:number, minPassGrade:number): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`age-group/${ageGroupId}/subject/${subjectAgeGroupId}`,{
      maxGrade,
      minPassGrade
    });
  }

  deleteSubject(id:number, subjectAgeGroupId:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`age-group/${id}/subject/${subjectAgeGroupId}`);
  }

  getSubjects(id:number,pageNumber:number,pageSize:number): Observable<Page<SubjectForAgeGroupModel>>{
    return this.http.get<Page<SubjectForAgeGroupModel>>(`age-group/${id}/subjects`,{
      PageNumber:pageNumber,
      PageSize:pageSize
    });
  }

  getStudyPlan(ageGroupId:number, ageGroupSubjectId:number, semesterId:number): Observable<StudyPlanWeekModel[]>{
    return this.http.get<StudyPlanWeekModel[]>(`age-group/${ageGroupId}/age-group-subject/${ageGroupSubjectId}/study-plan`, { SemesterId: semesterId });
  }

  addStudyPlan(ageGroupId:number, ageGroupSubjectId:number, body:{key:string, semesterId:number, weeks:StudyPlanWeekRequest[]}): Observable<MutateResponse>{
    return this.http.post<MutateResponse>(`age-group/${ageGroupId}/age-group-subject/${ageGroupSubjectId}/study-plan`, body);
  }

  updateStudyPlan(ageGroupId:number, ageGroupSubjectId:number, studyPlanId:number, title:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`age-group/${ageGroupId}/age-group-subject/${ageGroupSubjectId}/study-plan/${studyPlanId}`, { title });
  }

  deleteStudyPlan(ageGroupId:number, ageGroupSubjectId:number, studyPlanId:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`age-group/${ageGroupId}/age-group-subject/${ageGroupSubjectId}/study-plan/${studyPlanId}`);
  }
}


