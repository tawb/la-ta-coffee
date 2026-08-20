import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OrderStateService } from '../services/order-state.service';

export const confirmationGuard: CanActivateFn = (route) => {
  const orderState = inject(OrderStateService);
  const router = inject(Router);

  const id = route.paramMap.get('id');

  if (id && orderState.isValidConfirmation(id)) {
    return true;
  }

  return router.createUrlTree(['/']);
};