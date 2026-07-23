import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { UserForm } from './user-form';
import { UserService } from '../../../services/user';
import { Notification } from '../../../core/services/notification';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages';

describe('UserForm', () => {
  let component: UserForm;
  let fixture: ComponentFixture<UserForm>;
  let userServiceMock: { addUser: ReturnType<typeof vi.fn>; updateUser: ReturnType<typeof vi.fn>; getUserById: ReturnType<typeof vi.fn> };
  let notificationService: Notification;
  let router: Router;

  const validFormValue = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '9876543210',
    city: 'Chennai',
  };

  beforeEach(async () => {
    userServiceMock = {
      addUser: vi.fn(() => of({ id: 1, ...validFormValue })),
      updateUser: vi.fn(() => of({ id: 1, ...validFormValue })),
      getUserById: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserForm],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(Notification);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // runs ngOnInit (no 'id' param -> add mode, no getUserById call)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to "add" mode when no route id param is present', () => {
    expect(component.isEditMode).toBe(false);
    expect(userServiceMock.getUserById).not.toHaveBeenCalled();
  });

  it('should NOT call addUser or notify anything when the form is invalid', () => {
    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');

    component.onSubmit();

    expect(userServiceMock.addUser).not.toHaveBeenCalled();
    expect(showSuccessSpy).not.toHaveBeenCalled();
  });

  it('should push a "User created" success toast and navigate after adding a new user', () => {
    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');
    component.userForm.setValue(validFormValue);

    component.onSubmit();

    expect(userServiceMock.addUser).toHaveBeenCalledTimes(1);
    expect(showSuccessSpy).toHaveBeenCalledWith(ERROR_MESSAGES.USER_CREATED);
    expect(
      notificationService.notifications().some((n) => n.type === 'success'),
    ).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/users']);
  });

  it('should push a "User updated" success toast and navigate after editing an existing user', () => {
    component.isEditMode = true;
    component.userId = 42;

    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');
    component.userForm.setValue(validFormValue);

    component.onSubmit();

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42, ...validFormValue }),
    );
    expect(showSuccessSpy).toHaveBeenCalledWith(ERROR_MESSAGES.USER_UPDATED);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/users']);
  });

  it('should reset the form to a pristine state after a successful save', () => {
    component.userForm.setValue(validFormValue);
    component.userForm.markAsDirty();

    component.onSubmit();

    expect(component.userForm.pristine).toBe(true);
  });

  it('should use a different success message for create vs. update (not interchangeable)', () => {
    const showSuccessSpy = vi.spyOn(notificationService, 'showSuccess');
    component.userForm.setValue(validFormValue);

    component.onSubmit(); // add mode

    expect(showSuccessSpy).not.toHaveBeenCalledWith(ERROR_MESSAGES.USER_UPDATED);
  });
});