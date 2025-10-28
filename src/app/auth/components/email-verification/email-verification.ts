import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmailVerificationController, VerificationResult } from '../../controllers/email-verification.controller';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css'
})
export class EmailVerification implements OnInit {
  loading = true;
  verifying = false;
  verificationResult?: VerificationResult;
  errorMessage?: string;
  token?: string;

  private router = inject(Router);
  private emailVerificationController = inject(EmailVerificationController);

  ngOnInit(): void {
    this.extractAndVerifyToken();
  }

  /**
   * Extract token from URL and verify it
   */
  private extractAndVerifyToken(): void {
    const tokenValidation = this.emailVerificationController.extractAndValidateToken();

    if (!tokenValidation.valid) {
      this.loading = false;
      this.errorMessage = tokenValidation.error || 'Token inválido';
      return;
    }

    this.token = tokenValidation.token;
    this.verifyEmail();
  }

  /**
   * Verify email with token
   */
  private async verifyEmail(): Promise<void> {
    if (!this.token) return;

    this.verifying = true;

    try {
      const result = await this.emailVerificationController.verifyEmail(this.token);
      this.verificationResult = result;

      // If successful, redirect to login after 3 seconds
      if (result.success) {
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      this.errorMessage = 'Error al verificar el correo electrónico';
    } finally {
      this.loading = false;
      this.verifying = false;
    }
  }

  /**
   * Get verification status class for styling
   */
  get statusClass(): string {
    if (this.loading || this.verifying) return 'text-primary';
    if (this.verificationResult?.success) return 'text-success';
    return 'text-danger';
  }

  /**
   * Get verification status icon
   */
  get statusIcon(): string {
    if (this.loading || this.verifying) return 'bi-arrow-clockwise';
    if (this.verificationResult?.success) return 'bi-check-circle-fill';
    return 'bi-x-circle-fill';
  }

  /**
   * Get verification title
   */
  get verificationTitle(): string {
    if (this.loading) return 'Verificando Correo Electrónico';
    if (this.verifying) return 'Procesando Verificación';
    if (this.verificationResult?.success) return '¡Correo Verificado Exitosamente!';
    return 'Error en la Verificación';
  }

  /**
   * Get verification description
   */
  get verificationDescription(): string {
    if (this.loading) return 'Estamos verificando tu correo electrónico...';
    if (this.verifying) return 'Por favor espera mientras procesamos tu verificación...';
    if (this.verificationResult?.success) {
      return `¡Bienvenido ${this.verificationResult.user?.name}! Tu correo ha sido verificado correctamente. Serás redirigido al inicio de sesión...`;
    }
    return this.errorMessage || 'No pudimos verificar tu correo electrónico';
  }

  /**
   * Check if verification was successful
   */
  get isVerificationSuccessful(): boolean {
    return this.verificationResult?.success ?? false;
  }

  /**
   * Check if there are verification errors
   */
  get hasVerificationErrors(): boolean {
    return !this.loading && !this.verifying && !this.verificationResult?.success;
  }

  /**
   * Get verification errors
   */
  get verificationErrors(): string[] {
    return this.verificationResult?.errors || [];
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to register page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Get user display name
   */
  get userDisplayName(): string {
    return this.verificationResult?.user?.name || 'Usuario';
  }

  /**
   * Get user email
   */
  get userEmail(): string {
    return this.verificationResult?.user?.email || '';
  }
}