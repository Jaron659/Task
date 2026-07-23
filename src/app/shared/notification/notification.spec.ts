import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification';
import { Notification } from '../../core/services/notification';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: Notification;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(Notification);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no toasts when there are no notifications', () => {
    const toasts = fixture.nativeElement.querySelectorAll('.notification-toast');
    expect(toasts.length).toBe(0);
  });

  it('should render a toast for each notification in the service signal', () => {
    service.show('Message A', 'info', 0);
    service.show('Message B', 'error', 0);
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.notification-toast');
    expect(toasts.length).toBe(2);
    expect(toasts[0].textContent).toContain('Message A');
    expect(toasts[1].textContent).toContain('Message B');
  });

  it('should apply "alert-danger" for error notifications', () => {
    service.showError('Broken');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.notification-toast');
    expect(toast.classList.contains('alert-danger')).toBe(true);
  });

  it('should apply "alert-success" for success notifications', () => {
    service.showSuccess('Saved');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.notification-toast');
    expect(toast.classList.contains('alert-success')).toBe(true);
  });

  it('should apply "alert-warning" for warning notifications', () => {
    service.showWarning('Careful');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.notification-toast');
    expect(toast.classList.contains('alert-warning')).toBe(true);
  });

  it('should apply "alert-info" for info notifications', () => {
    service.showInfo('FYI');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.notification-toast');
    expect(toast.classList.contains('alert-info')).toBe(true);
  });

  it('should call notificationService.dismiss(id) when the close button is clicked', () => {
    service.show('Dismiss me', 'info', 0);
    fixture.detectChanges();

    const expectedId = service.notifications()[0].id;
    const dismissSpy = vi.spyOn(service, 'dismiss');

    const closeButton = fixture.nativeElement.querySelector('.btn-close');
    closeButton.click();

    expect(dismissSpy).toHaveBeenCalledWith(expectedId);
  });

  it('should remove the toast from the DOM after it is dismissed', () => {
    service.show('Temporary', 'info', 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.notification-toast').length).toBe(1);

    const id = service.notifications()[0].id;
    service.dismiss(id);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.notification-toast').length).toBe(0);
  });
});
