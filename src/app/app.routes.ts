import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'manager',
    loadChildren: () => import('./features/manager/manager.routes').then(r => r.DASHBOARD_ROUTES),
    // canActivate:[authGuard]
  },
  { path: '', redirectTo: 'manager', pathMatch: 'full' , },  
  { path: '**', redirectTo: 'manager' },
];