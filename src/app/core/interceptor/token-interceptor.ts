import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { Language } from '../services/language';

interface CustomError {
  message: string;
  status: number;
}

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);
    const language = inject(Language);
    
    const authData = authService.getAuth(); 
    
    let modifiedRequest = req;

    if (authData && authData.token) {
      
      modifiedRequest = req.clone({ 
        setHeaders: {
          Authorization: `Bearer ${authData.token}`,
          language:language.language()
        }
      });
    }

    // Fix: Directly return the observable chain without calling .handle()
    return next(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
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
            case 404:
              errorMessage = language.transform('http_404');
              break;
            case 409:
            case 412:
              errorMessage = error.error.Title;
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
        
        const customError: CustomError = {
          message: errorMessage,
          status: 1
        };

        return throwError(() => customError);
      })
    );
}
