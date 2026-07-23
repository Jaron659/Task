import { inject } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs';
import { UserService } from '../../services/user';

export function uniqueEmailValidator(): AsyncValidatorFn {
  const userService = inject(UserService);

  return (control) => {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return userService.checkEmailExists(control.value).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(exists => (exists ? { emailTaken: true } : null)),
      first()
    );
  };
}
