import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { confirmationGuard } from './confirmation.guard';
import { OrderStateService } from '../services/order-state.service';

describe('confirmationGuard', () => {
  let orderState: OrderStateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    orderState = TestBed.inject(OrderStateService);
    router = TestBed.inject(Router);
  });

  function runGuard(id: string | null) {
    const route = { paramMap: { get: () => id } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() =>
      confirmationGuard(route, state)
    );
  }

  it('should allow access when the id matches a real confirmation', () => {
    const realId = orderState.createConfirmation();

    const result = runGuard(realId);

    expect(result).toBe(true);
  });

  it('should block access and redirect home when the id is fake', () => {
    const result = runGuard('FAKE99');

    expect(result).not.toBe(true);
    expect(result instanceof UrlTree).toBe(true);
  });

  it('should block access when there is no id at all', () => {
    const result = runGuard(null);

    expect(result).not.toBe(true);
    expect(result instanceof UrlTree).toBe(true);
  });
});