import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'restaurants', loadComponent: () => import('./pages/restaurant/restaurant.component').then(c => c.RestaurantComponent) },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: '/restaurants' },
];
