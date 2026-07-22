import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { Notification } from '../services/notification';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(Notification);
  const router = inject(Router);

  return next(req).pipe(
    retry(1),
    catchError((error: HttpErrorResponse) => {
      let message: string;

      switch (error.status) {
        case 400:
          message = ERROR_MESSAGES.BAD_REQUEST;
          break;
        case 401:
          message = ERROR_MESSAGES.UNAUTHORIZED;
          router.navigate(['/login']);
          break;
        case 403:
          message = ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 409:
          message = ERROR_MESSAGES.CONFLICT;
          break;
        case 500:
          message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
          break;
        case 0:
          message = ERROR_MESSAGES.NETWORK_ERROR;
          break;
        default:
          message = ERROR_MESSAGES.UNKNOWN_ERROR;
      }

      notificationService.showError(message);
      return throwError(() => new Error(message));
    }),
  );
};
