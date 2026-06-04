import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { ROLES } from '../model/roles';
import { StaffPermission } from '../enums/staff-permission.enum';
import { StaffProfileService } from '../../features/staff/services/staff-profile.service';

/**
 * Factory guard — checks a specific StaffPermission.
 * Admin always passes. Staff must have the permission or gets redirected to /denied.
 */
export const staffPermissionGuard = (permission: StaffPermission): CanActivateFn => () => {
  const router      = inject(Router);
  const authService = inject(AuthService);
  const staffProfile = inject(StaffProfileService);

  // Admin always has access
  if (authService.getAuth()?.role === ROLES.ADMIN) return true;

  return staffProfile.ensureLoaded().pipe(
    map(() => {
      if (staffProfile.hasPermission(permission)) return true;
      return router.parseUrl('/denied');
    }),
    catchError(() => of(router.parseUrl('/denied'))),
  );
};
