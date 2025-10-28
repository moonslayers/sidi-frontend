// src/app/components/usuario-form/usuario-form.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../controllers/usuario.service';
import { RoleService } from '../../../controllers/role.service';
import { Usuario } from '../../../models/usuario';
import { Role, Permission } from '../../../models/role';
import { LocalStorageService } from '../../../services/localStorage/local-storage.service';
import { EmailVerificationController } from '../../../auth/controllers/email-verification.controller';
import { EmailStatus } from '../../../shared/components/email-status/email-status';


@Component({
  selector: 'app-usuario-form',
  standalone: true,
  // Importa los módulos necesarios para el componente
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmailStatus
  ],
  templateUrl: './usuarios-form.html',
  styleUrls: ['./usuarios-form.css'],
})
export class UsuariosForm implements OnInit {
  // El grupo de controles principal del formulario
  usuarioForm!: FormGroup;

  // Bandera para controlar la visualización de la alerta de éxito
  submitted = false;

  // Opciones para el campo de tipo de usuario
  userTypes: { value: 'INTERNO' | 'EXTERNO'; label: string }[] = [
    { value: 'INTERNO', label: 'Usuario Interno' },
    { value: 'EXTERNO', label: 'Usuario Externo' },
  ];

  // Propiedades para modo edición
  isEditMode = false;
  loading = false;
  usuario?: Usuario;

  // Propiedades para manejo de roles
  rolesDisponibles: Role[] = [];
  usuarioRoles: Role[] = [];
  rolSeleccionado = '';
  permisosRol: Permission[] = [];
  loadingRoles = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public storage = inject(LocalStorageService);
  private usuarioService = inject(UsuarioService);
  private roleService = inject(RoleService);
  private emailVerificationController = inject(EmailVerificationController);

  async ngOnInit(): Promise<void> {
    // Detectar si estamos en modo edición
    let usuarioId = Number(this.route.snapshot.params['usuario_id']);

    this.isEditMode = this.route.snapshot.url.some(r => r.toString().includes('editar'));

    const user = this.storage.getUser()?.user
    if (this.isEditMode && !usuarioId) {
      usuarioId = user?.id ?? 0
    }

    // Inicializa el formulario primero de forma síncrona
    this.usuarioForm = this.fb.group({
      rfc: [
        '',
        [
          Validators.required,
          Validators.pattern(
            // Regex simple para RFC, puede ser ajustado
            /^[A-Za-z]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Za-z0-9]{3}?$/
          ),
        ],
      ],
      user_type: ['EXTERNO', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      role: ['', [Validators.required]],
      password: [
        '',
        [
          // El password es requerido solo para nuevos usuarios
          this.isEditMode && user?.id !== usuarioId ? Validators.nullValidator : Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/) // Al menos una mayúscula, una minúscula y un número
        ]
      ],
    });

    // Cargar roles disponibles
    await this.cargarRolesDisponibles();

    // Si es modo edición, cargar los datos del usuario
    if (this.isEditMode && usuarioId) {
      await this.loadUsuarioData(usuarioId);
    }
  }

  get showPasswordInput() {
    const user = this.storage.getUser()?.user

    return (!this.isEditMode || user?.id === this.usuario?.id) || this.storage.esAdmin()
  }

  private async loadUsuarioData(usuarioId: number): Promise<void> {
    if (!usuarioId) return;

    this.loading = true;
    this.usuario = await this.usuarioService.getUserWithRoles(usuarioId);

    if (this.usuario) {
      // Obtener roles del usuario
      this.usuarioRoles = this.usuario.roles || [];
      if (this.usuarioRoles.length > 0) {
        this.rolSeleccionado = this.usuarioRoles[0].name;
        await this.cargarPermisosRol(this.rolSeleccionado);
      }

      // Poblar el formulario con los datos existentes (sin el password)
      this.usuarioForm.patchValue({
        rfc: this.usuario.rfc,
        user_type: this.usuario.user_type,
        name: this.usuario.name,
        email: this.usuario.email,
        role: this.rolSeleccionado
        // El password no se incluye por seguridad en modo edición
      });
      this.loading = false;
    }
  }

  /**
   * Carga la lista de roles disponibles desde el API
   */
  private async cargarRolesDisponibles(): Promise<void> {
    if (!this.storage.getRolUser()?.includes('admin')) {
      return;
    }

    this.loadingRoles = true;
    try {
      const response = await this.roleService.getAvailableRoles();
      this.rolesDisponibles = response.data || [];
    } catch (error) {
      console.error('Error cargando roles disponibles:', error);
    } finally {
      this.loadingRoles = false;
    }
  }

  /**
   * Carga los permisos de un rol específico
   */
  public async cargarPermisosRol(roleName: string): Promise<void> {
    if (!this.storage.getRolUser()?.includes('admin')) {
      return;
    }

    if (!roleName) {
      this.permisosRol = [];
      return;
    }

    try {
      this.permisosRol = await this.roleService.getRolePermissions(roleName);
    } catch (error) {
      console.error('Error cargando permisos del rol:', error);
      this.permisosRol = [];
    }
  }

  /**
   * Maneja el cambio de rol seleccionado
   */
  public async onRolChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    this.rolSeleccionado = target.value;
    await this.cargarPermisosRol(this.rolSeleccionado);
  }

  // Getter para acceder fácilmente a los controles del formulario en la plantilla
  get f(): Record<string, AbstractControl> {
    return this.usuarioForm.controls;
  }

  async onSubmit(): Promise<void> {
    // Si el formulario es inválido, marca todos los campos como 'touched' para mostrar los errores
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formData = this.usuarioForm.value;

    if (this.isEditMode && this.usuario) {
      // Modo edición: actualizar usuario existente y su rol
      const updateData = { ...formData };
      delete updateData.password; // No enviar password en modo edición

      const res = await this.usuarioService.update(this.usuario.id, updateData);
      if (!res.status) {
        return;
      }

      // Si el rol cambió, actualizarlo
      if (this.rolSeleccionado && this.usuarioRoles.length > 0 && this.rolSeleccionado !== this.usuarioRoles[0].name) {
        await this.roleService.assignRoleToUser(this.usuario.id, this.rolSeleccionado);
      }

      console.log('Usuario actualizado:', updateData);
    } else {
      // Modo creación: crear nuevo usuario con rol
      const res = await this.usuarioService.createWithRole(formData, formData.role);
      if (!res) {
        return
      }
      console.log('Usuario creado con rol:', formData);
    }

    // Muestra la alerta de éxito
    this.submitted = true;

    // Redirigir a la lista después de un tiempo breve
    setTimeout(() => {
      this.router.navigate(['/main/usuarios/lista']);
    }, 2000);
  }

  // Método para cancelar y volver a la lista
  onCancel(): void {
    this.router.navigate(['/usuarios/lista']);
  }

  // Getter para el título dinámico
  get titulo(): string {
    return this.isEditMode ? 'Editar Usuario' : 'Nuevo Usuario';
  }

  // Getter para el texto del botón
  get textoBoton(): string {
    return this.isEditMode ? 'Actualizar Usuario' : 'Guardar Usuario';
  }

  // Email verification methods
  async resendVerificationEmail(): Promise<void> {
    if (!this.usuario?.email) return;

    try {
      const result = await this.emailVerificationController.resendVerification(this.usuario.email);

      if (result.success) {
        // Show success message
        console.log('Correo de verificación reenviado exitosamente');
      } else {
        // Show error message
        console.error('Error al reenviar correo:', result.errors);
      }
    } catch (error) {
      console.error('Error al reenviar correo de verificación:', error);
    }
  }

  async checkEmailVerificationStatus(): Promise<boolean> {
    if (!this.usuario?.email) return false;

    try {
      const result = await this.emailVerificationController.checkVerificationStatus(this.usuario.email);
      return result.success ? result.isVerified : false;
    } catch (error) {
      console.error('Error al verificar estado del email:', error);
      return false;
    }
  }

  // Getter para obtener el email del usuario
  get usuarioEmail(): string {
    return this.usuario?.email || '';
  }

  // Getter para saber si el email está verificado (basado en datos del usuario)
  get isEmailVerified(): boolean {
    return !!this.usuario?.email_verified_at;
  }
}