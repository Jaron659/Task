import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, Subject, finalize, map, retry, startWith, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  loading = signal(false);

  private usersSubject = new BehaviorSubject<User[]>([]);

  users$ = this.usersSubject.asObservable();

  private refresh$ = new Subject<void>();

  constructor() {
    this.refresh$.pipe(
      startWith(undefined),
      switchMap(() => this.fetchUsers())
    ).subscribe(users => this.usersSubject.next(users));
  }

  loadUsers(): void {
    this.loading.set(true);
    this.refresh$.next();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      retry(1)
    );
  }

  checkEmailExists(email: string, excludeId?: number): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (excludeId) {
          return users.some(u => u.email === email && u.id !== excludeId);
        }
        return users.length > 0;
      })
    );
  }

  addUser(user: User): Observable<User> {
    this.loading.set(true);

    return this.http.post<User>(this.apiUrl, this.toUserPayload(user)).pipe(
      finalize(() => this.loadUsers())
    );
  }

  updateUser(user: User): Observable<User> {
    this.loading.set(true);

    return this.http.put<User>(`${this.apiUrl}/${user.id}`, this.toUserPayload(user)).pipe(
      finalize(() => this.loadUsers())
    );
  }

  deleteUser(id: number): Observable<void> {
    this.loading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.loadUsers())
    );
  }

  private fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      retry(1),
      map(users => [...users].sort((a, b) => a.firstName.localeCompare(b.firstName))),
      finalize(() => this.loading.set(false))
    );
  }

  private toUserPayload(user: User): User {
    return {
      id: user.id,
      createdAt: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumbers: user.phoneNumbers,
      city: user.city,
    };
  }
}
