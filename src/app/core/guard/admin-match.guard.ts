import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ROLES } from '../model/roles';

/** Returns true only for authenticated Admins — falls through to next route otherwise */
export const adminMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService).getAuth();
  if (!auth || auth.isExpired()) return false;
  return auth.role === ROLES.ADMIN;
};
