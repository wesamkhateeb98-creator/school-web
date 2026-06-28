import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { AuthModel } from '../model/auth-model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {
  private readonly REFRESH_URL = `${environment.apiBaseUrl}/user/refresh-token`;

  private isRefreshing = false;
  private refreshSubject$ = new BehaviorSubject<AuthModel | null>(null);

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private router      = inject(Router);

  /**
   * Attempts to refresh the access token using the stored refresh token.
   * If a refresh is already in progress, waits for it to complete instead
   * of making a duplicate request (concurrency protection).
   */
  refresh(): Observable<AuthModel> {
    if (this.isRefreshing) {
      return this.refreshSubject$.pipe(
        filter((auth): auth is AuthModel => auth !== null),
        take(1),
      );
    }

    const auth = this.authService.getAuth();
    if (!auth?.refreshToken) {
      return this.logout();
    }

    this.isRefreshing = true;
    this.refreshSubject$.next(null);

    return this.http.post<any>(this.REFRESH_URL, { refreshToken: auth.refreshToken }).pipe(
      map(response => new AuthModel(response)),
      tap(newAuth => {
        this.authService.setAuth(newAuth);
        this.isRefreshing = false;
        this.refreshSubject$.next(newAuth);
      }),
      catchError(() => {
        this.isRefreshing = false;
        this.refreshSubject$.next(null);
        return this.logout();
      }),
    );
  }

  private logout(): Observable<never> {
    this.authService.removeAuth();
    this.router.navigate(['/login']);
    return throwError(() => ({ message: 'Session expired. Please login again.', status: 401 }));
  }
}
