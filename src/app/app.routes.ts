import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'restaurants', loadComponent: () => import('./pages/restaurant/restaurant.component').then(c => c.RestaurantComponent) },
  { path: 'restaurants/new', loadComponent: () => import('./pages/restaurant/new/new-restaurant.component').then(c => c.NewRestaurantComponent) },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: '/restaurants' },
];
