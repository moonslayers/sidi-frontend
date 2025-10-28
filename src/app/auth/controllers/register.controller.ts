import { Injectable, inject } from '@angular/core';
import { RegisterService, RegisterData, ValidationError } from '../services/register.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterController {
  private registerService = inject(RegisterService);

  /**
   * Register a new user (solicitante)
   */
  async register(userData: RegisterData): Promise<{ success: boolean; message: string; errors?: ValidationError[] }> {
    try {
      // Client-side validations before sending to backend
      const validationResult = this.validateUserData(userData);
      if (!validationResult.valid) {
        return {
          success: false,
          message: 'Error de validación',
          errors: validationResult.errors
        };
      }

      // Send to backend
      const response = await this.registerService.register(userData).toPromise();

      if (response?.status) {
        return {
          success: true,
          message: response.message || 'Usuario registrado exitosamente'
        };
      } else {
        // Handle backend validation errors
        const errors = response?.errors ?
          this.registerService.formatValidationErrors(response.errors) :
          [];

        return {
          success: false,
          message: response?.message || 'Error al registrar usuario',
          errors: errors.length > 0 ? errors : undefined
        };
      }
    } catch (error: unknown) {
      console.error('Error en RegisterController:', error);

          const errorMessage = error && typeof error === 'object' && 'message' in error ?
        (error as { message: string }).message :
        'Error al registrar usuario. Por favor, intenta más tarde.';

    const errorDetails = error && typeof error === 'object' && 'errors' in error ?
      this.registerService.formatValidationErrors((error as { errors: Record<string, string[]> }).errors) :
      undefined;

      return {
        success: false,
        message: errorMessage,
        errors: errorDetails
      };
    }
  }

  /**
   * Validate user data before sending to backend
   */
  private validateUserData(userData: RegisterData): { valid: boolean; errors?: ValidationError[] } {
    const errors: ValidationError[] = [];

    // Validate name
    if (!userData.name || userData.name.trim().length < 3) {
      errors.push({
        field: 'Nombre',
        message: 'El nombre debe tener al menos 3 caracteres'
      });
    }

    if (userData.name && userData.name.length > 255) {
      errors.push({
        field: 'Nombre',
        message: 'El nombre no puede exceder los 255 caracteres'
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push({
        field: 'Correo electrónico',
        message: 'El formato del correo electrónico no es válido'
      });
    }

    // Validate RFC
    const rfcValidation = this.registerService.validateRFC(userData.rfc);
    if (!rfcValidation.valid) {
      errors.push({
        field: 'RFC',
        message: rfcValidation.message || 'RFC inválido'
      });
    }

    // Validate password
    const passwordValidation = this.registerService.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      errors.push({
        field: 'Contraseña',
        message: passwordValidation.message || 'Contraseña inválida'
      });
    }

    // Validate password confirmation
    if (userData.password !== userData.password_confirmation) {
      errors.push({
        field: 'Confirmación de contraseña',
        message: 'Las contraseñas no coinciden'
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Check if RFC format is valid (without backend call)
   */
  isValidRFC(rfc: string): boolean {
    return this.registerService.validateRFC(rfc).valid;
  }

  /**
   * Check if password meets requirements (without backend call)
   */
  isValidPassword(password: string): boolean {
    return this.registerService.validatePassword(password).valid;
  }

  /**
   * Get specific RFC validation message
   */
  getRFCValidationMessage(rfc: string): string | undefined {
    const validation = this.registerService.validateRFC(rfc);
    return validation.valid ? undefined : validation.message;
  }

  /**
   * Get specific password validation message
   */
  getPasswordValidationMessage(password: string): string | undefined {
    const validation = this.registerService.validatePassword(password);
    return validation.valid ? undefined : validation.message;
  }
}