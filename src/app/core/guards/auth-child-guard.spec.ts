import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authChildGuard } from './auth-child-guard';

describe('authChildGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
