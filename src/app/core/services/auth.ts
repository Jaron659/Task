import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  login(username: string, password: string): Observable<boolean> {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      return of(true);
    }

    return throwError(() => new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
