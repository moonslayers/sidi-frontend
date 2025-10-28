import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterController } from '../../controllers/register.controller';
import { ValidationError } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  registrationErrors: ValidationError[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registerController = inject(RegisterController);

  constructor() {
    this.registerForm = this.fb.group({
      rfc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z&Ññ]{3,4}[0-9]{6}[A-Za-z0-9]{3}$/), // Patrón del backend
        ],
      ],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Backend requiere 8 caracteres
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f(): Record<string, AbstractControl> {
    return this.registerForm.controls;
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup): Record<string, boolean> | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.registrationErrors = [];

    try {
      const formData = { ...this.registerForm.value };

      // Preparar datos para el backend (backend usa password_confirmation)
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        rfc: formData.rfc.trim().toUpperCase()
      };

      // Usar el nuevo controller de registro
      const result = await this.registerController.register(registerData);

      if (result.success) {
        this.submitted = true;
        // Redirigir al login después de 3 segundos para dar tiempo de leer el mensaje
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        // Mostrar errores del backend
        this.registrationErrors = result.errors || [];
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.registrationErrors = [{
        field: 'General',
        message: 'Error inesperado. Por favor, intenta más tarde.'
      }];
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método para alternar visibilidad de contraseña
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    const input = document.getElementById(field) as HTMLInputElement;
    const icon = document.getElementById(`${field}-icon`) as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    }
  }
}