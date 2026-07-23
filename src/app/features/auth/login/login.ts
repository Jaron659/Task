import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, take } from 'rxjs';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages';
import { Notification } from '../../../core/services/notification';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  guardMessage = '';

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(Notification);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken() !== null) {
      this.router.navigate(['/dashboard/users']);
      return;
    }

    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params: Record<string, string>) => {
      this.guardMessage = params['message'] || '';
    });

    this.loginForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) =>
        prev.username === curr.username && prev.password === curr.password
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.guardMessage) {
        this.guardMessage = '';
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).pipe(
      take(1),
      catchError(() => {
        this.notificationService.showError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        return of(false);
      })
    ).subscribe((success) => {
      if (success) {
        this.notificationService.showSuccess(ERROR_MESSAGES.LOGIN_SUCCESSFUL);
        setTimeout(() => {
          this.router.navigate(['/dashboard/users']);
        },1000);
      }
    });
  }
}
