import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';
import { Denied } from './features/shared/components/denied-screen/denied';
import { Language } from './core/services/language';
import { messageTitle } from './core/consts';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'manager',
    loadChildren: () => import('./features/manager/manager.routes').then(r => r.DASHBOARD_ROUTES),
    canActivate:[authGuard],
  },
  {
    path: 'denied',
    title: messageTitle('denied_title'),
    component: Denied
  },
  { path: '', redirectTo: 'manager', pathMatch: 'full',},  
  { path: '**', redirectTo: 'manager'},
];