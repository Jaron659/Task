import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.interface';
import { Modal } from '../../../core/services/modal';
import { Notification } from '../../../core/services/notification';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages';
import { filter, map, switchMap, take } from 'rxjs';
import { noWhitespaceValidator } from '../../../core/validators/custom-validators';
import { uniqueEmailValidator } from '../../../core/validators/async-validators';
import { InputTrimDirective } from '../../../shared/directives/input-trim.directive';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements CanComponentDeactivate, OnInit {

  modalService = inject(Modal);
  notificationService = inject(Notification);

  userForm!: FormGroup;
  isEditMode = false;
  userId = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, noWhitespaceValidator()]],
      lastName: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email], [uniqueEmailValidator()]],
      city: ['', [Validators.required, noWhitespaceValidator()]],
      phoneNumbers: this.fb.array([], Validators.required),
    });
  }

  get phoneNumbers(): FormArray {
    return this.userForm.get('phoneNumbers') as FormArray;
  }

  addPhoneNumber(value = ''): void {
    this.phoneNumbers.push(
      this.fb.control(value, [Validators.required, Validators.pattern(/^[0-9]{10}$/)])
    );
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbers.removeAt(index);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      filter(params => params.has('id')),
      map(params => +params.get('id')!),
      switchMap(id => {
        this.isEditMode = true;
        this.userId = id;
        return this.userService.getUserById(id);
      }),
      take(1)
    ).subscribe(user => {
      this.phoneNumbers.clear();
      if (user.phoneNumbers?.length) {
        user.phoneNumbers.forEach(p => this.addPhoneNumber(p));
      } else {
        this.addPhoneNumber();
      }

      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
      });

      if (this.isEditMode) {
        this.userForm.get('email')?.clearAsyncValidators();
        this.userForm.get('email')?.updateValueAndValidity();
      }
    });

    if (!this.isEditMode) {
      this.addPhoneNumber();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;

    if (this.isEditMode) {
      const updatedUser = { id: this.userId, ...formValue };

      this.userService.updateUser(updatedUser)
        .pipe(take(1))
        .subscribe(() => {
          this.userForm.markAsPristine();
          this.userForm.reset();
          this.notificationService.showSuccess(ERROR_MESSAGES.USER_UPDATED);
          this.router.navigate(['/dashboard/users']);
        });
    } else {
      const newUser = { id: Date.now(), ...formValue };

      this.userService.addUser(newUser)
        .pipe(take(1))
        .subscribe(() => {
          this.userForm.markAsPristine();
          this.userForm.reset();
          this.notificationService.showSuccess(ERROR_MESSAGES.USER_CREATED);
          this.router.navigate(['/dashboard/users']);
        });
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (!this.userForm.dirty) {
      return true;
    }

    return this.modalService.confirm(
      'Unsaved Changes',
      'You have unsaved changes. Do you really want to leave this page?'
    );
  }
}
