import { TestBed } from '@angular/core/testing';

import { Modal } from './modal';

describe('Modal', () => {
  let service: Modal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Modal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve a confirmation only once and clear the pending state', async () => {
    const promise = service.confirm('Delete', 'Are you sure?');
    let resolvedCount = 0;

    promise.then(() => resolvedCount++);

    service.confirmAction();
    service.confirmAction();

    await Promise.resolve();

    expect(resolvedCount).toBe(1);
    expect(service.visible()).toBeFalse();
  });
});
