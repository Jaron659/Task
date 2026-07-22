import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, finalize, map, retry, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/users';

  loading = signal(false);

  getUsers(): Observable<User[]> {
    this.loading.set(true);

    return this.http.get<User[]>(this.apiUrl).pipe(
      retry(1),
      map(users => [...users].sort((a, b) => a.firstName.localeCompare(b.firstName))),
      finalize(() => this.loading.set(false))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      retry(1),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  addUser(user: User): Observable<User> {
    this.loading.set(true);

    return this.http.post<User>(this.apiUrl, user).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  updateUser(user: User): Observable<User> {
    this.loading.set(true);

    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  deleteUser(id: number): Observable<void> {
    this.loading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}
