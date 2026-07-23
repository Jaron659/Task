import { TestBed } from '@angular/core/testing';

import { Notification } from './notification';

describe('Notification', () => {
  let service: Notification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notification);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty notifications list', () => {
    expect(service.notifications()).toEqual([]);
  });

  it('should default to type "error" when show() is called without a type', () => {
    service.show('Something went wrong');

    const [notification] = service.notifications();
    expect(notification.type).toBe('error');
    expect(notification.message).toBe('Something went wrong');
  });

  it('should assign a unique, incrementing id to each notification', () => {
    service.show('First');
    service.show('Second');

    const [first, second] = service.notifications();
    expect(first.id).not.toBe(second.id);
    expect(second.id).toBeGreaterThan(first.id);
  });

  it('should append notifications rather than replace existing ones', () => {
    service.show('First', 'info', 0);
    service.show('Second', 'warning', 0);

    expect(service.notifications().length).toBe(2);
  });

  it('showError() should push a notification of type "error"', () => {
    service.showError('Server error');
    expect(service.notifications()[0].type).toBe('error');
  });

  it('showSuccess() should push a notification of type "success"', () => {
    service.showSuccess('Saved successfully');
    expect(service.notifications()[0].type).toBe('success');
  });

  it('showWarning() should push a notification of type "warning"', () => {
    service.showWarning('Please double-check this');
    expect(service.notifications()[0].type).toBe('warning');
  });

  it('showInfo() should push a notification of type "info"', () => {
    service.showInfo('Heads up');
    expect(service.notifications()[0].type).toBe('info');
  });

  it('dismiss() should remove only the notification with the matching id', () => {
    service.show('Keep me', 'info', 0);
    service.show('Remove me', 'error', 0);

    const idToRemove = service.notifications()[1].id;
    service.dismiss(idToRemove);

    const remaining = service.notifications();
    expect(remaining.length).toBe(1);
    expect(remaining[0].message).toBe('Keep me');
  });

  it('dismiss() with a non-existent id should not change the list', () => {
    service.show('Only one', 'info', 0);
    service.dismiss(9999);

    expect(service.notifications().length).toBe(1);
  });

  it('should auto-dismiss a notification after its duration elapses', () => {
    vi.useFakeTimers();

    service.show('Temporary message', 'success', 3000);
    expect(service.notifications().length).toBe(1);

    vi.advanceTimersByTime(2999);
    expect(service.notifications().length).toBe(1);

    vi.advanceTimersByTime(1);
    expect(service.notifications().length).toBe(0);
  });

  it('should use the default duration per severity when none is passed explicitly', () => {
    vi.useFakeTimers();

    service.showSuccess('Saved!'); // default 3000ms
    vi.advanceTimersByTime(3000);
    expect(service.notifications().length).toBe(0);

    service.showError('Failed!'); // default 5000ms
    vi.advanceTimersByTime(4999);
    expect(service.notifications().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(service.notifications().length).toBe(0);
  });

  it('should NOT auto-dismiss when duration is 0', () => {
    vi.useFakeTimers();

    service.show('Sticky message', 'warning', 0);
    vi.advanceTimersByTime(100000);

    expect(service.notifications().length).toBe(1);
  });
});
