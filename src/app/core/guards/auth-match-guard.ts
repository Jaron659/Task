import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authMatchGuard: CanMatchFn = () => {

  console.log('CanMatch Executed');

  const authService = inject(Auth);

  const router = inject(Router);

  if (authService.isLoggedIn()) {

    console.log('User Logged In');

    return true;

  }

  console.log('User Not Logged In');

  return router.createUrlTree(['/login']);

};