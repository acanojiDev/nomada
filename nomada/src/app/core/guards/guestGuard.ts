import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard = (): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    if (auth.isAuthenticated()) {
      return router.createUrlTree(['/home']);
    }
    return true;
  };
};