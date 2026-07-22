import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.interface';
import { Modal } from '../../../core/services/modal';
import { filter, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements CanComponentDeactivate, OnInit {

  modalService = inject(Modal);

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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      city: ['', Validators.required]
    });
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
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      const updatedUser = { id: this.userId, ...this.userForm.value };

      this.userService.updateUser(updatedUser)
        .pipe(take(1))
        .subscribe(() => {
          this.userForm.markAsPristine();
          this.userForm.reset();
          this.router.navigate(['/dashboard/users']);
        });
    } else {
      const newUser = { id: Date.now(), ...this.userForm.value };

      this.userService.addUser(newUser)
        .pipe(take(1))
        .subscribe(() => {
          this.userForm.markAsPristine();
          this.userForm.reset();
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
