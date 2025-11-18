import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const data = authService.getAuth();
    if (!data) {
      return router.parseUrl('/auth/login');
    }

    const currentDate = new Date();
    const expirationDate = new Date(data.expirationDate);

    if (currentDate > expirationDate) {
      authService.removeAuth();
      return router.parseUrl('/auth/login');
    }
    if (data.role === 0 && router.url.startsWith('/manager')) {
      return true; // allow admin access to /manager
    } else if (data.role === 1 &&  router.url.startsWith('/consumer')) {
      return true; // allow user access to /consumer
    }

    // If role doesn't match route, redirect to their default page
    if (data.role === 0) {
      return router.parseUrl('/manager');
    } else if (data.role === 1) {
      return router.parseUrl('/consumer');
    }
    return router.parseUrl('/manager');
};
