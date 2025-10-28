import { Routes } from "@angular/router";
import { UsuariosList } from "./usuarios-list/usuarios-list";
import { UsuariosForm } from "./usuarios-form/usuarios-form";

export const usuariosRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lista',
    },
    {
        path: 'lista',
        component: UsuariosList,
        title: 'Usuarios',
    },
    {
        path: 'nuevo',
        title: 'Nuevo Usuario',
        component: UsuariosForm,
    },
    {
        path: 'editar/:usuario_id',
        title: 'Editar Usuario',
        component: UsuariosForm,
    },
    {
        path: 'editar',
        title: 'Editar Usuario',
        component: UsuariosForm,
    }
]