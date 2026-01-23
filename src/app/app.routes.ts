import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
