import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {

  const authService = inject(Auth);

  const router = inject(Router);

  if (authService.getToken() !== null) {

    return true;

  }

  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        message: 'Please login to continue'
      }
    }
  );

};