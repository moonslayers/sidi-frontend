import { Routes } from "@angular/router";

export const mainRoutes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./welcome/welcome.component').then(c => c.WelcomeComponent)
  },
  {
    path: 'usuarios',
    title: 'Usuarios',
    loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.usuariosRoutes)
  }
]