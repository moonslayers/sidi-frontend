import { Injectable, inject } from '@angular/core';
import { EmailVerificationService } from '../services/email-verification.service';

export interface VerificationResult {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    rfc: string;
    user_type: string;
    email_verified_at?: string;
    created_at: string;
  };
  verifiedAt?: string;
  errors?: string[];
}

export interface ResendResult {
  success: boolean;
  message: string;
  expiresAt?: string;
  errors?: string[];
}

export interface CheckResult {
  success: boolean;
  isVerified: boolean;
  hasPendingVerification: boolean;
  emailVerifiedAt?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationController {
  private emailVerificationService = inject(EmailVerificationService);

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<VerificationResult> {
    try {
      // Client-side validation
      if (!this.emailVerificationService.isValidToken(token)) {
        return {
          success: false,
          message: 'El token de verificación no tiene un formato válido',
          errors: ['El token debe tener 64 caracteres hexadecimales']
        };
      }

      const response = await this.emailVerificationService.verifyEmail(token).toPromise();

      if (response?.status && response.data) {
        return {
          success: true,
          message: response.message || 'Correo electrónico verificado exitosamente',
          user: response.data.user,
          verifiedAt: response.data.verified_at
        };
      } else {
        const errors = response?.errors ?
          this.emailVerificationService.formatVerificationErrors(response.errors) :
          [];

        return {
          success: false,
          message: response?.message || 'Error al verificar el correo electrónico',
          errors: errors.length > 0 ? errors : ['Error desconocido al verificar el email']
        };
      }
    } catch (error: unknown) {
      console.error('Error en EmailVerificationController.verifyEmail:', error);

      const errorMessage = error && typeof error === 'object' && 'message' in error ?
        (error as { message: string }).message :
        'Error al verificar el correo electrónico. Por favor, intenta más tarde';

      return {
        success: false,
        message: errorMessage,
        errors: [ errorMessage ]
      };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<ResendResult> {
    try {
      // Client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return {
          success: false,
          message: 'El correo electrónico no tiene un formato válido',
          errors: ['El formato del correo electrónico es inválido']
        };
      }

      const response = await this.emailVerificationService.resendVerification(email).toPromise();

      if (response?.status && response.data) {
        return {
          success: true,
          message: response.message || 'Se ha enviado un nuevo correo de verificación',
          expiresAt: response.data.expires_at
        };
      } else {
        const errors = response?.errors ?
          this.emailVerificationService.formatVerificationErrors(response.errors) :
          [];

        return {
          success: false,
          message: response?.message || 'Error al reenviar el correo de verificación',
          errors: errors.length > 0 ? errors : ['Error desconocido al reenviar email']
        };
      }
    } catch (error: unknown) {
      console.error('Error en EmailVerificationController.resendVerification:', error);

      const errorMessage = error && typeof error === 'object' && 'message' in error ?
        (error as { message: string }).message :
        'Error al reenviar el correo de verificación. Por favor, intenta más tarde';

      return {
        success: false,
        message: errorMessage,
        errors: ['Error de conexión con el servidor']
      };
    }
  }

  /**
   * Check email verification status
   */
  async checkVerificationStatus(email: string): Promise<CheckResult> {
    try {
      // Client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return {
          success: false,
          isVerified: false,
          hasPendingVerification: false,
          errors: ['El formato del correo electrónico es inválido']
        };
      }

      const response = await this.emailVerificationService.checkVerificationStatus(email).toPromise();

      if (response?.status && response.data) {
        return {
          success: true,
          isVerified: response.data.is_verified,
          hasPendingVerification: response.data.has_pending_verification,
          emailVerifiedAt: response.data.email_verified_at
        };
      } else {
        const errors = response?.errors ?
          this.emailVerificationService.formatVerificationErrors(response.errors) :
          [];

        return {
          success: false,
          isVerified: false,
          hasPendingVerification: false,
          errors: errors.length > 0 ? errors : ['Error desconocido al verificar estado']
        };
      }
    } catch (error: unknown) {
      console.error('Error en EmailVerificationController.checkVerificationStatus:', error);

          return {
        success: false,
        isVerified: false,
        hasPendingVerification: false,
        errors: ['Error de conexión con el servidor']
      };
    }
  }

  /**
   * Get token from URL and validate it
   */
  extractAndValidateToken(): { valid: boolean; token?: string; error?: string } {
    const token = this.emailVerificationService.extractTokenFromUrl();

    if (!token) {
      return {
        valid: false,
        error: 'No se encontró un token de verificación en la URL'
      };
    }

    if (!this.emailVerificationService.isValidToken(token)) {
      return {
        valid: false,
        error: 'El token de verificación no tiene un formato válido'
      };
    }

    return {
      valid: true,
      token
    };
  }

  /**
   * Get user-friendly error message based on status
   */
  getErrorMessage(status: number): string {
    switch (status) {
      case 404:
        return 'El token de verificación es inválido o no existe';
      case 410:
        return 'El token de verificación ha expirado. Por favor, solicita un nuevo correo de verificación';
      case 422:
        return 'El token de verificación no es válido';
      case 429:
        return 'Demasiados intentos de verificación. Por favor, espera un momento antes de intentar nuevamente';
      case 500:
        return 'Error del servidor. Por favor, intenta más tarde';
      default:
        return 'Error desconocido al verificar el correo electrónico';
    }
  }
}