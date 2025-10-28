import { Routes } from "@angular/router";
import { Login } from "./components/login/login";
import { Register } from "./components/register/register";
import { EmailVerification } from "./components/email-verification/email-verification";
import { AuthGuard } from "../guards/auth.guard";

export const authRoutes:Routes =[
    { path:'', redirectTo: 'login', pathMatch:'full' },
    {
        title:'Inicia sesión',
        path:'login',
        component:Login,
        canActivate: [AuthGuard], // Redirigir si ya está logueado
    },
    {
        title:'Regístrate',
        path:'register',
        component:Register,
        canActivate: [AuthGuard], // Redirigir si ya está logueado
    },
    {
        title:'Verificar Correo Electrónico',
        path:'verify-email',
        component:EmailVerification,
        // SIN canActivate - debe ser pública para verificación de email
    }
]