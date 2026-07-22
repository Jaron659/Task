import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject, finalize, startWith, switchMap, take } from 'rxjs';
import { UserService } from '../../../services/user';
import { User } from '../../../models/user.model';
import { Modal } from '../../../core/services/modal';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {

  private modalService = inject(Modal);
  private userService = inject(UserService);

  private refresh$ = new Subject<void>();

  users$: Observable<User[]> = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() => this.userService.getUsers())
  );

  deleteUser(id: number): void {
    this.modalService.confirm(
      'Delete',
      'Are you sure you want to delete this user?',
      'Delete',
      'Cancel'
    ).then((isDelete) => {
      if (!isDelete) {
        return;
      }

      this.userService.deleteUser(id)
        .pipe(
          take(1),
          finalize(() => this.refresh$.next())
        )
        .subscribe();
    });
  }
}
