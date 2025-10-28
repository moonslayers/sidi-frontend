import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/localStorage/local-storage.service';

/**
 * Guard para proteger rutas de autenticación (login, register)
 * Redirige a usuarios ya logueados al panel principal
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  /**
   * Verifica si el usuario está logueado
   * @returns boolean - true si puede acceder, false si debe ser redirigido
   */
  canActivate(): boolean {
    // Verificar si el usuario está logueado usando el servicio existente
    if (this.localStorageService.isUserLogged()) {
      // Usuario ya está logueado, redirigir al panel principal
      this.router.navigate(['/main']);
      return false; // Bloquear acceso a login/registro
    }

    // Usuario no está logueado, permitir acceso a login/registro
    return true;
  }
}

/**
 * Guard para rutas que requieren autenticación
 * Redirige a login si el usuario no está logueado
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  /**
   * Verifica si el usuario está logueado
   * @returns boolean - true si puede acceder, false si debe ser redirigido a login
   */
  canActivate(): boolean {
    if (!this.localStorageService.isUserLogged()) {
      // Usuario no está logueado, redirigir a login
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Usuario está logueado, permitir acceso
    return true;
  }
}