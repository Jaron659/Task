import { inject } from '@angular/core';

import {
  CanActivateChildFn,
  Router
} from '@angular/router';

import { Auth } from '../services/auth';
export const authChildGuard: CanActivateChildFn = () => {

  const authService = inject(Auth);

  const router = inject(Router);

  if (authService.getToken() !== null) {

    return true;

  }

  router.navigate(['/login']);

  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        message: 'Please login to continue'
      }
    }
  );

};