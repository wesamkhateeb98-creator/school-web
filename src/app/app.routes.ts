import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';
import { messageTitle } from './core/consts';
import { Denied } from './features/shared/components/denied-screen/denied';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES),
  },
  {
    path: 'manager',
    canActivate: [authGuard],
    loadChildren: () => import('./features/manager/manager.routes').then(r => r.DASHBOARD_ROUTES),
  },
  {
    path: 'denied',
    title: messageTitle('denied_title'),
    component: Denied,
  },
  { path: '',   redirectTo: 'manager', pathMatch: 'full' },
  { path: '**', redirectTo: 'manager' },
];
