import { Routes } from '@angular/router';
import { AuthPage } from './features/auth-page/auth-page';
import { authenticatedGuard } from './core/guards/authenticatedGuard';
import { WelcomePage } from './features/welcome-page/welcome-page';
import { guestGuard } from './core/guards/guestGuard';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
    canActivate: [authenticatedGuard()],
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth-page/auth-page').then(m => m.AuthPage),
    canActivate: [guestGuard()],
  }
];
