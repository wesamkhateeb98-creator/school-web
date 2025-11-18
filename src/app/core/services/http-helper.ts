import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from './language';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class HttpHelper {
    private readonly BASE_URL = 'http://localhost:5156/api/v1.0';

  constructor(public http: HttpClient, public language:Language, public authService:AuthService) {}

  private buildParams(filters?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value);
        }
      });
    }
    return params;
  }

  get<T>(endpoint: string, filters?: Record<string, any>): Observable<T> {
    let params = this.buildParams(filters);
    return this.http.get<T>( `${this.BASE_URL}/${endpoint}`, { params:params, headers:this.getHeader() },);
  }

  post<T>(endpoint: string, body: any, filters?: Record<string, any>): Observable<T> {
    console.log(body);
    const params = this.buildParams(filters);
    return this.http.post<T>(`${this.BASE_URL}/${endpoint}`, body, { params, headers:this.getHeader() });
  }

  put<T>(endpoint: string, body: any, filters?: Record<string, any>): Observable<T> {
    const params = this.buildParams(filters);
    return this.http.put<T>(`${this.BASE_URL}/${endpoint}`, body, { params , headers:this.getHeader()});
  }

  delete<T>(endpoint: string, filters?: Record<string, any>): Observable<T> {
    const params = this.buildParams(filters);
    return this.http.delete<T>(`${this.BASE_URL}/${endpoint}`, { params , headers:this.getHeader()});
  }

  getHeader(): HttpHeaders {
    let auth = this.authService.getAuth();
    console.log(auth);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth? `Bearer ${auth.token}`:""
    });
  }
}
