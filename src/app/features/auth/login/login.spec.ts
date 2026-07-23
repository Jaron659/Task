import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { Login } from './login';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let notificationService: Notification;
  let router: Router;

  beforeEach(async () => {
    localStorage.removeItem('auth_token');

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(Notification);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.removeItem('auth_token');
    vi.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not attempt login or notify anything when the form is invalid', () => {
    fixture.detectChanges();

    const showErrorSpy = vi.spyOn(notificationService, 'showError');
    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');

    component.loginForm.setValue({ username: '', password: '' });
    component.login();

    expect(showErrorSpy).not.toHaveBeenCalled();
    expect(showSuccessSpy).not.toHaveBeenCalled();
  });

  it('should push an error notification and NOT navigate on invalid credentials', () => {
    fixture.detectChanges();

    const showErrorSpy = vi.spyOn(notificationService, 'showError');

    component.loginForm.setValue({ username: 'wrong', password: 'wrong' });
    component.login();

    expect(showErrorSpy).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_CREDENTIALS);
    expect(
      notificationService.notifications().some((n) => n.type === 'error'),
    ).toBe(true);
    expect(router.navigate).not.toHaveBeenCalledWith(['/dashboard/users']);
  });

  it('should push a success notification and navigate to the dashboard on valid credentials', () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');

    component.loginForm.setValue({ username: 'admin', password: '1234' });
    component.login();

    // Success toast fires immediately...
    expect(showSuccessSpy).toHaveBeenCalledWith(ERROR_MESSAGES.LOGIN_SUCCESSFUL);
    expect(router.navigate).not.toHaveBeenCalled();

    // ...navigation is intentionally delayed 1s so the user sees the toast.
    vi.advanceTimersByTime(1000);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/users']);
  });

  it('should redirect immediately in ngOnInit if the user is already logged in', () => {
    localStorage.setItem('auth_token', 'dGVzdDp0ZXN0');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/users']);
  });
});