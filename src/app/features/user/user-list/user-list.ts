import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, take, finalize } from 'rxjs';
import { UserService } from '../../../services/user';
import { User } from '../../../models/user.model';
import { Modal } from '../../../core/services/modal';
import { PhoneFormatPipe } from '../../../shared/pipes/phone-format.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TitleCasePipe,
    DatePipe,
    PhoneFormatPipe,
    TruncatePipe,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  private modalService = inject(Modal);
  private userService = inject(UserService);

  users$: Observable<User[]> = this.userService.users$;
  isLoading = this.userService.loading;

  ngOnInit(): void {
    this.userService.loadUsers();
  }

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
          finalize(() => this.userService.loadUsers())
        ).subscribe();
    });
  }
}
