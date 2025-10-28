import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  rfc: string;
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      rfc: string;
      user_type: string;
      email_verified_at?: string;
      created_at: string;
    };
    roles: string[];
    permissions: string[];
  };
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private http = inject(HttpClient);
  private apiUrl = environment.api_url;

  /**
   * Register a new user (solicitante)
   */
  register(userData: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/api/auth/register`, userData).pipe(
      map(response => {
        console.log('Registro exitoso:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido al registrar usuario';
    let validationErrors: Record<string, string[]> = {};

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida';
          break;
        case 422:
          errorMessage = 'Error de validación';
          if (error.error?.errors) {
            validationErrors = error.error.errors;
          }
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente.';
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error en registro:', {
      status: error.status,
      message: errorMessage,
      errors: validationErrors,
      fullError: error
    });

    return throwError(() => ({
      status: false,
      message: errorMessage,
      errors: validationErrors
    }));
  }

  /**
   * Validate RFC format (client-side validation)
   */
  validateRFC(rfc: string): { valid: boolean; message?: string } {
    const rfcPattern = /^[A-Za-z&Ññ]{3,4}[0-9]{6}[A-Za-z0-9]{3}$/;

    if (!rfc) {
      return { valid: false, message: 'El RFC es obligatorio' };
    }

    if (!rfcPattern.test(rfc)) {
      return {
        valid: false,
        message: 'El RFC debe tener un formato válido (12 caracteres para persona moral, 13 para persona física). Ejemplo: ABCD123456XYZ'
      };
    }

    return { valid: true };
  }

  /**
   * Check if password meets requirements
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
      return { valid: false, message: 'La contraseña es obligatoria' };
    }

    if (password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    return { valid: true };
  }

  /**
   * Get formatted validation errors from backend response
   */
  formatValidationErrors(errors: Record<string, string[]>): ValidationError[] {
    const formattedErrors: ValidationError[] = [];

    for (const [field, messages] of Object.entries(errors)) {
      for (const message of messages) {
        formattedErrors.push({
          field: this.translateFieldName(field),
          message
        });
      }
    }

    return formattedErrors;
  }

  /**
   * Translate field names to Spanish for better UX
   */
  private translateFieldName(field: string): string {
    const fieldTranslations: Record<string, string> = {
      'name': 'Nombre',
      'email': 'Correo electrónico',
      'password': 'Contraseña',
      'password_confirmation': 'Confirmación de contraseña',
      'rfc': 'RFC',
      'user_type': 'Tipo de usuario'
    };

    return fieldTranslations[field] || field;
  }
}