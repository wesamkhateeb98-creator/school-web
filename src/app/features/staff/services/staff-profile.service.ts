import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { StaffPermission } from '../../../core/enums/staff-permission.enum';
import { StaffProfileEndpoint } from './staff-profile-endpoint';

@Injectable({ providedIn: 'root' })
export class StaffProfileService {
  private endpoint = inject(StaffProfileEndpoint);

  permissions = signal<number[]>([]);
  loaded      = signal(false);

  /** Fetches the profile once — subsequent calls are no-ops */
  loadProfile(): void {
    if (this.loaded()) return;
    this.ensureLoaded().subscribe();
  }

  /** Returns Observable that resolves after profile is loaded (cached after first call) */
  ensureLoaded(): Observable<void> {
    if (this.loaded()) return of(undefined);

    return this.endpoint.getProfile().pipe(
      tap({
        next: res => {
          this.permissions.set(res.profile.permissions);
          this.loaded.set(true);
        },
        error: () => {
          this.permissions.set([]);
          this.loaded.set(true);
        },
      }),
      // map to void regardless of result
      tap(() => {}),
    ) as unknown as Observable<void>;
  }

  hasPermission(permission: StaffPermission): boolean {
    return this.permissions().includes(permission);
  }

  reset(): void {
    this.permissions.set([]);
    this.loaded.set(false);
  }
}
