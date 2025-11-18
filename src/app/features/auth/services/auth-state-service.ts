import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  // Replace with real HTTP call
  login(name: string, password: string): Observable<string> {
    // fake validation
    if (name === 'demo' && password === 'password') {
      return of('ok').pipe(delay(500));
    }
    return throwError(() => 'Invalid credentials').pipe(delay(500));
  }
}
