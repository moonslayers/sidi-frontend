import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/login-credentials';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  rfc=''
  password=''
  loading = false

  //services
  private router = inject(Router);
  private authService = inject(AuthService);
  hidePassword = true;

  // ... constructor y otros métodos como ngOnInit()

  // Método para alternar la visibilidad
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  public async submit(){
      this.loading = true;

      try {
          const credentials: LoginCredentials = {
              rfc: this.rfc.toUpperCase(),
              password: this.password
          };
          const result = await this.authService.login(credentials);

          if (result) {
              this.router.navigate(['/main/inicio']);
          }
      } catch (error) {
          console.error('Error en login:', error);
      } finally {
          this.loading = false;
      }
  }
}
