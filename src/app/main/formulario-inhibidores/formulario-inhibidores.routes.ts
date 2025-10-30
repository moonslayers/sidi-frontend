import { Routes } from "@angular/router";
import { FormularioInhibidoresForm } from "./formulario-inhibidores-form/formulario-inhibidores-form";

export const formularioInhibidoresRoutes: Routes = [
    {
        path: '',
        redirectTo: 'seccion-a',
        pathMatch: 'full',
        title: 'Formulario'        
    },
    {
        path: 'seccion-a',
        title: 'Seccion A',
        component: FormularioInhibidoresForm
    }
]