
import { Routes } from '@angular/router';
import { AuthLayout } from './auth-layout/auth-layout';
import { Login } from './pages/login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: '', 
    component: AuthLayout,
    children: [
      { path: 'login', component: Login, title: 'Login' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
