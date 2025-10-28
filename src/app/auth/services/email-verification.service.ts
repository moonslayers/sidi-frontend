import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
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
    verified_at: string;
  };
  errors?: Record<string, string[]>;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  status: boolean;
  message: string;
  data?: {
    expires_at: string;
    email: string;
  };
  errors?: Record<string, string[]>;
}

export interface CheckVerificationRequest {
  email: string;
}

export interface CheckVerificationResponse {
  status: boolean;
  data?: {
    email: string;
    is_verified: boolean;
    has_pending_verification: boolean;
    email_verified_at?: string;
  };
  errors?: Record<string, string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  private http = inject(HttpClient);
  private apiUrl = environment.api_url;
  private route= inject(ActivatedRoute)

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    const request: VerifyEmailRequest = { token };

    return this.http.post<VerifyEmailResponse>(`${this.apiUrl}/api/auth/verify-email`, request).pipe(
      map(response => {
        console.log('Email verificado exitosamente:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Resend verification email
   */
  resendVerification(email: string): Observable<ResendVerificationResponse> {
    const request: ResendVerificationRequest = { email };

    return this.http.post<ResendVerificationResponse>(`${this.apiUrl}/api/auth/resend-verification`, request).pipe(
      map(response => {
        console.log('Email de verificación reenviado:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Check email verification status
   */
  checkVerificationStatus(email: string): Observable<CheckVerificationResponse> {
    const request: CheckVerificationRequest = { email };

    return this.http.post<CheckVerificationResponse>(`${this.apiUrl}/api/auth/check-verification`, request).pipe(
      map(response => {
        console.log('Estado de verificación:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    let errors: Record<string, string[]> = {};

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida';
          break;
        case 404:
          errorMessage = 'El token de verificación es inválido o ha expirado';
          break;
        case 410:
          errorMessage = 'El token de verificación ha expirado';
          break;
        case 422:
          errorMessage = 'Error de validación';
          if (error.error?.errors) {
            errors = error.error.errors;
          }
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente';
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, intenta más tarde';
          break;
        default:
          errorMessage = error.error?.message || `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error en verificación de email:', {
      status: error.status,
      message: errorMessage,
      errors: errors,
      fullError: error
    });

    return throwError(() => ({
      status: false,
      message: errorMessage,
      errors: errors
    }));
  }

  /**
   * Check if token format is valid (client-side validation)
   */
  isValidToken(token: string): boolean {
    // Token must be exactly 64 characters (SHA256 hash)
    return /^[a-fA-F0-9]{64}$/.test(token);
  }

  /**
   * Extract token from URL query parameters
   */
  extractTokenFromUrl(): string | null {
    const urlParams = this.route.snapshot.queryParams
    const token = urlParams['token'];

    if (token && this.isValidToken(token)) {
      return token;
    }

    return null;
  }

  /**
   * Format verification errors for display
   */
  formatVerificationErrors(errors: Record<string, string[]>): string[] {
    const formattedErrors: string[] = [];

    for (const [, messages] of Object.entries(errors)) {
      for (const message of messages) {
        formattedErrors.push(message);
      }
    }

    return formattedErrors;
  }
}