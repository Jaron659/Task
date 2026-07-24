import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take, finalize } from 'rxjs';
import { UserService } from '../../../services/user';
import { User } from '../../../models/user.model';
import { Modal } from '../../../core/services/modal';
import { PhoneFormatPipe } from '../../../shared/pipes/phone-format.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

type SortField = 'id' | 'name' | 'date';
type SortDirection = 'asc' | 'desc';

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

  isLoading = this.userService.loading;

  // Raw list coming from the service, exposed as a signal so it can be
  // combined with the search/sort signals below inside a single computed().
  private users = toSignal(this.userService.users$, { initialValue: [] as User[] });

  // Search bar state.
  searchTerm = signal('');

  // Sort menu state. Defaults to the same order the API/service already
  // returns (id ascending) so nothing changes until the user picks a sort.
  sortField = signal<SortField>('id');
  sortDirection = signal<SortDirection>('asc');

  // Single source of truth for what the table renders: filtered, then sorted.
  // Recomputes automatically whenever users(), searchTerm(), sortField() or
  // sortDirection() change.
  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    const filtered = term
      ? this.users().filter(user => this.matchesSearch(user, term))
      : this.users();

    return this.sortUsers(filtered, this.sortField(), this.sortDirection());
  });

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
  }

  // The sort <select> posts a single "field-direction" value (e.g. "name-asc")
  // so the template only needs one control instead of two dropdowns.
  onSortOptionChange(option: string): void {
    const [field, direction] = option.split('-') as [SortField, SortDirection];
    this.sortField.set(field);
    this.sortDirection.set(direction);
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

  private matchesSearch(user: User, term: string): boolean {
    const fields: string[] = [
      user.firstName,
      user.lastName,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.city,
      ...(user.phoneNumbers ?? []),
    ];

    return fields.some(field => field?.toLowerCase().includes(term));
  }

  private sortUsers(users: User[], field: SortField, direction: SortDirection): User[] {
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...users].sort((a, b) => {
      switch (field) {
        case 'name': {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;
        }
        case 'date':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier;
        case 'id':
        default:
          return (a.id - b.id) * multiplier;
      }
    });
  }
}
