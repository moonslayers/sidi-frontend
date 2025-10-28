import { Routes } from '@angular/router';

export const routes: Routes = [
        { 
        path:'',
        title:'Identifícate',
        loadComponent: ()=> import('./auth/auth').then(c => c.Auth),
        loadChildren: () => import('./auth/auth.routes').then(m=> m.authRoutes),
    },
        { 
        path:'main', 
        title:'SIDI',
        loadComponent: () => import('./main/main').then( c => c.Main), 
        loadChildren: ()=> import('./main/main.routes').then(m => m.mainRoutes ) 
    },
];
