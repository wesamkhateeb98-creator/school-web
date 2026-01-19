import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { StudentModel } from './models/student/student-model';
import { SubjectFilterViewModel } from '../../pages/subject/model/subject-filter-view-model';
import { SubjectViewModel } from '../../pages/subject/model/subject-view-model';
import { StudyPlanWeekModel } from './models/subject/study-plan-week-model';
import { Semester } from '../../pages/semester/semester';

@Injectable({
  providedIn: 'root',
})
export class SubjectEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, name:string ,description:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("subject",{
      "key": key,
      "name": name,
      "description": description
    })
  }

  update(subjectId:number, name:string ,description:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`subject/${subjectId}`,{
      "name": name,
      "description": description
    })
  }

  get(pageNumber:number, pageSize:number , name:string|undefined = undefined):Observable<Page<SubjectViewModel>>{
    return this.http.get('subject',{
        pageNumber: pageNumber,
        pageSize: pageSize,
        name: name
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`subject/${id}`);
  }
 
  // ######################### study plan #########################

  
  addStudyPlane(key:string, subjectId:number, semesterId:number, weeks:StudyPlanWeekModel[]): Observable<MutateResponse>{
    return this.http.post<MutateResponse>(`subject/${subjectId}/study-plan`,{
      "key": key,
      "semesterId": semesterId,
      "weeks": weeks
    })
  }

  updateStudyPlane(studyPlanId:number ,subjectId:number, title:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`/Subject/${subjectId}/study-plan/${studyPlanId}`,{
      "title": title
    })
  }

  getStudyPlane(subjectId:number, semesterId:number):Observable<WeekModel[]>{
    return this.http.get(`Subject/${subjectId}/study-plan`,{
        semesterId:semesterId
      })
  }

  deleteStudyPlane(studyPlanId:number ,subjectId:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`/Subject/${subjectId}/study-plan/${studyPlanId}`);
  }
 

}