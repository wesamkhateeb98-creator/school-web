import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { Language } from '../services/language';
import { RefreshTokenService } from '../services/refresh-token.service';

interface CustomError {
  message: string;
  status: number;
}

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService       = inject(AuthService);
    const language          = inject(Language);
    const refreshTokenSvc   = inject(RefreshTokenService);

    const authData = authService.getAuth();

    let modifiedRequest = req;
    if (authData?.token) {
      modifiedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authData.token}`,
          language: language.language()
        }
      });
    }

    return next(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {

        // ── 401 → try refresh token (skip if the request IS the refresh endpoint)
        if (error.status === 401 && !req.url.includes('refresh-token')) {
          return refreshTokenSvc.refresh().pipe(
            switchMap(newAuth => {
              const retried = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAuth.token}`,
                  language: language.language()
                }
              });
              return next(retried);
            }),
            catchError(() => throwError(() => <CustomError>{
              message: language.transform('http_401'),
              status: 401
            }))
          );
        }

        // ── other errors
        let errorMessage = 'An unknown error occurred.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 0:
              errorMessage = language.transform('network_down');
              break;
            case 401:
              errorMessage = language.transform('http_401');
              break;
            case 403:
              errorMessage = language.transform('http_403');
              break;
            case 400:
            case 404:
            case 409:
            case 412:
              errorMessage = error.error?.Title || error.error?.title
                || Object.values(error.error?.Extensions ?? {})[0] as string
                || language.transform('server_error');
              break;
            case 500:
              errorMessage = language.transform('http_500') || 'Internal server error';
              break;
            default:
              if (error.error && typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = language.transform('server_error');
              }
          }
        }

        return throwError(() => <CustomError>{ message: errorMessage, status: error.status });
      })
    );
}
