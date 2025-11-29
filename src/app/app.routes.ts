import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./features/landing/landing')
  },
  {
    path: 'descubrenos',
    loadComponent: () => import('./features/discover/discover')
  },
  {
    path: 'productos',
    loadComponent: () => import('./features/products/product'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list')
      },
      {
        path: ':id',
        loadComponent: () => import('./features/products/product-detail/product-detail')
      }
    ]
  },
  {
    path: 'contactanos',
    loadComponent: () => import('./features/contact/contact')
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog')
  }
];
