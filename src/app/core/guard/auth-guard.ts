import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ROLES } from '../model/roles';

/** Allows both Admin and AdministrativeStaff — layout is decided inside manager.routes via canMatch */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);
  const data        = authService.getAuth();

  if (!data || data.isExpired()) {
    authService.removeAuth();
    return router.parseUrl('/auth/login');
  }

  if (data.role === ROLES.ADMIN || data.role === ROLES.ADMINISTRATIVE_STAFF) {
    return true;
  }

  return router.parseUrl('/denied');
};
