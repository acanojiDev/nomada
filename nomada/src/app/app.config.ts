import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Auth } from './core/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const auth = inject(Auth);
      return auth.checkSession();
    }),
  ]
};
