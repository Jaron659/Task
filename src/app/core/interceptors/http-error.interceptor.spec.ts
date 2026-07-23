import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';

import { httpErrorInterceptor } from './http-error.interceptor';
import { Notification } from '../services/notification';
import { ERROR_MESSAGES } from '../constants/error-messages';

describe('httpErrorInterceptor', () => {
  let notificationService: Notification;
  let router: Router;

  const runInterceptor = (status: number) => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () =>
      throwError(
        () => new HttpErrorResponse({ status, statusText: 'Error', url: '/api/test' }),
      );

    return TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    });

    notificationService = TestBed.inject(Notification);
    router = TestBed.inject(Router);
    vi.spyOn(notificationService, 'showError');
  });

  it.each([
    [400, ERROR_MESSAGES.BAD_REQUEST],
    [401, ERROR_MESSAGES.UNAUTHORIZED],
    [403, ERROR_MESSAGES.FORBIDDEN],
    [404, ERROR_MESSAGES.NOT_FOUND],
    [409, ERROR_MESSAGES.CONFLICT],
    [500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR],
    [0, ERROR_MESSAGES.NETWORK_ERROR],
    [418, ERROR_MESSAGES.UNKNOWN_ERROR], // unmapped status -> default branch
  ])('should call showError with the correct message for status %i', (status, expected) => {
    runInterceptor(status as number).subscribe({
      error: () => {
        expect(notificationService.showError).toHaveBeenCalledWith(expected);
      },
    });
  });

  it('should redirect to /login on a 401 response', () => {
    runInterceptor(401).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      },
    });
  });

  it('should NOT redirect to /login for non-401 errors', () => {
    runInterceptor(500).subscribe({
      error: () => {
        expect(router.navigate).not.toHaveBeenCalled();
      },
    });
  });

  it('should re-throw an Error so the caller/component can still react to the failure', () => {
    runInterceptor(404).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(ERROR_MESSAGES.NOT_FOUND);
      },
    });
  });

  it('should let a successful response pass through untouched, without notifying', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () => of({ ok: true } as any);

    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next)).subscribe(
      (res) => {
        expect(res).toEqual({ ok: true });
        expect(notificationService.showError).not.toHaveBeenCalled();
      },
    );
  });
});
