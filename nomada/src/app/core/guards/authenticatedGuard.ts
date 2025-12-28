import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const authenticatedGuard = (): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const isAuthenticated = auth.isAuthenticated();

    if (isAuthenticated) {
      return true;
    } else {
      return router.createUrlTree(['/auth']);
    }
  };
};