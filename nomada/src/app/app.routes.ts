import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticatedGuard';
import { guestGuard } from './core/guards/guestGuard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home-page/home-page').then(m => m.HomePage),
    canActivate: [authenticatedGuard()],
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/landing-page/landing-page').then(m => m.LandingPage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth-page/auth-page').then(m => m.AuthPage),
    canActivate: [guestGuard()],
  },
  {
    path: 'details',
    loadComponent: () => import('./features/details-page/details-page').then(m => m.DetailsPage),
    canActivate: [authenticatedGuard()]
  },
  {
    path: '**',
    loadComponent: () => import('./features/error-page/error-page').then(m => m.ErrorPage)
  }
];
