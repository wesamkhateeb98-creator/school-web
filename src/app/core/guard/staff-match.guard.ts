import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ROLES } from '../model/roles';

/** Matches only for AdministrativeStaff — authGuard already handled auth above */
export const staffMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService).getAuth();
  return auth?.role === ROLES.ADMINISTRATIVE_STAFF;
};
