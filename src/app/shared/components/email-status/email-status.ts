import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailVerificationController, CheckResult } from '../../../auth/controllers/email-verification.controller';

@Component({
  selector: 'app-email-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './email-status.html',
  styleUrl: './email-status.css'
})
export class EmailStatus implements OnInit {
  email = input.required<string>();
  showResendButton = input<boolean>(true);
  compact = input<boolean>(false);

  loading = signal<boolean>(false);
  isVerified = signal<boolean>(false);
  hasPendingVerification = signal<boolean>(false);
  lastChecked = signal<Date | null>(null);
  error = signal<string | null>(null);
  resendLoading = signal<boolean>(false);
  resendSuccess = signal<boolean>(false);
  resendError = signal<string | null>(null);

  private emailVerificationController = inject(EmailVerificationController);

  ngOnInit(): void {
    this.checkEmailStatus();
  }

  /**
   * Check email verification status
   */
  async checkEmailStatus(): Promise<void> {
    const emailValue = this.email();
    if (!emailValue) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const result: CheckResult = await this.emailVerificationController.checkVerificationStatus(emailValue);

      if (result.success) {
        this.isVerified.set(result.isVerified);
        this.hasPendingVerification.set(result.hasPendingVerification);
        this.lastChecked.set(new Date());
      } else {
        this.error.set(result.errors?.join(', ') || 'Error al verificar estado');
      }
    } catch (error) {
      console.error('Error checking email status:', error);
      this.error.set('Error de conexión');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<void> {
    const emailValue = this.email();
    if (!emailValue) return;

    this.resendLoading.set(true);
    this.resendError.set(null);
    this.resendSuccess.set(false);

    try {
      const result = await this.emailVerificationController.resendVerification(emailValue);

      if (result.success) {
        this.resendSuccess.set(true);
        // Refresh status after successful resend
        setTimeout(() => {
          this.checkEmailStatus();
        }, 2000);

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.resendSuccess.set(false);
        }, 5000);
      } else {
        this.resendError.set(result.errors?.join(', ') || 'Error al reenviar correo');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      this.resendError.set('Error de conexión al reenviar correo');
    } finally {
      this.resendLoading.set(false);
    }
  }

  /**
   * Get status badge class
   */
  get statusBadgeClass(): string {
    if (this.loading()) return 'bg-secondary';
    if (this.isVerified()) return 'bg-success';
    if (this.hasPendingVerification()) return 'bg-warning text-dark';
    return 'bg-danger';
  }

  /**
   * Get status icon
   */
  get statusIcon(): string {
    if (this.loading()) return 'bi-arrow-clockwise spin';
    if (this.isVerified()) return 'bi-check-circle-fill';
    if (this.hasPendingVerification()) return 'bi-clock-fill';
    return 'bi-x-circle-fill';
  }

  /**
   * Get status text
   */
  get statusText(): string {
    if (this.loading()) return 'Verificando...';
    if (this.isVerified()) return 'Verificado';
    if (this.hasPendingVerification()) return 'Pendiente de verificación';
    return 'No verificado';
  }

  /**
   * Get status description
   */
  get statusDescription(): string {
    if (this.isVerified()) return 'El correo electrónico ha sido verificado correctamente';
    if (this.hasPendingVerification()) return 'Se ha enviado un correo de verificación';
    return 'El correo electrónico no ha sido verificado';
  }

  /**
   * Check if email is verified
   */
  get isEmailVerified(): boolean {
    return this.isVerified();
  }

  /**
   * Check if email verification is pending
   */
  get isVerificationPending(): boolean {
    return this.hasPendingVerification();
  }

  /**
   * Check if there's an error
   */
  get hasError(): boolean {
    return !!this.error();
  }

  /**
   * Get error message
   */
  get errorMessage(): string | null {
    return this.error();
  }

  /**
   * Check if resend button should be shown
   */
  get shouldShowResendButton(): boolean {
    return this.showResendButton() && !this.isVerified() && !this.loading();
  }

  /**
   * Format last checked time
   */
  get lastCheckedFormatted(): string {
    const last = this.lastChecked();
    if (!last) return '';

    const now = new Date();
    const diff = now.getTime() - last.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;

    const days = Math.floor(hours / 24);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  }
}