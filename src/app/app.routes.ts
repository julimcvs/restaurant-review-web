import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: 'restaurants', loadComponent: () => import('./pages/restaurant/restaurant.component').then(c => c.RestaurantComponent) },
  { path: 'restaurants/new', loadComponent: () => import('./pages/restaurant/new/new-restaurant.component').then(c => c.NewRestaurantComponent) },
  { path: 'restaurants/reservation/:id', loadComponent: () => import('./pages/restaurant/reservation/reservation.component').then(c => c.ReservationComponent) },
  { path: 'restaurants/configuration/:id', loadComponent: () => import('./pages/restaurant/configuration/restaurant-configuration.component').then(c => c.RestaurantConfigurationComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: '/restaurants' },
];
