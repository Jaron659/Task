import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private static readonly TOKEN_KEY = 'auth_token';

  private isAuthenticated = new BehaviorSubject<boolean>(this.loadInitialAuthState());

  authState$ = this.isAuthenticated.asObservable();

  login(username: string, password: string): Observable<boolean> {
    if (username === 'admin' && password === '1234') {
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem(Auth.TOKEN_KEY, token);
      this.isAuthenticated.next(true);
      return of(true);
    }

    return throwError(() => new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
  }

  logout(): void {
    localStorage.removeItem(Auth.TOKEN_KEY);
    this.isAuthenticated.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(Auth.TOKEN_KEY);
  }

  private loadInitialAuthState(): boolean {
    return localStorage.getItem(Auth.TOKEN_KEY) !== null;
  }
}
