import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VanillaDialogService } from '../../services/vanilla-dialog/vanilla-dialog.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { Login } from '../models/login';
import { LoginCredentials } from '../models/login-credentials';

const api = environment.api_url

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient)
    private storage = inject(LocalStorageService)
    private dialog = inject(VanillaDialogService)

    public async login(credentials: LoginCredentials): Promise<Login | null> {
        try {
            const res = await lastValueFrom(
                this.http.post<Login>(`${api}/api/auth/login`, { ...credentials }).pipe(
                    catchError((error: HttpErrorResponse) => {
                        this.dialog.show({
                            title: 'Login incorrecto',
                            body: error.error?.message || 'Error desconocido',
                            tipo: 'danger'
                        });
                        return throwError(() => error);
                    })
                )
            );

            if (res) {
                this.storage.setUser(res);
                return res;
            }

            this.dialog.show({
                title: 'Error',
                body: 'RFC o contraseña incorrectos',
                tipo: 'danger'
            });
            return null;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
}
