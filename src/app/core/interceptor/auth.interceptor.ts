// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const storage = inject(LocalStorageService);
    const router = inject(Router);

    // Clonar la request y agregar headers de auth si existe token
    const authReq = addAuthHeader(req, storage);

    return next(authReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                handleUnauthorizedError(storage, router);
            }
            return throwError(() => error);
        })
    );
};

// Función helper para agregar el header de autorización
const addAuthHeader = (request: HttpRequest<unknown>, storage: LocalStorageService): HttpRequest<unknown> => {
    const token = storage.getUserToken();

    if (token) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return request;
};

// Función helper para manejar errores 401
const handleUnauthorizedError = (storage: LocalStorageService, router: Router): void => {
    // Limpiar datos de autenticación
    storage.deleteUser();

    // Redirigir al login
    router.navigate(['/login'], {
        queryParams: {
            sessionExpired: 'true',
            redirectUrl: router.url
        }
    });
};