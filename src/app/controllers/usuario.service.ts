import { Injectable } from "@angular/core";
import { SuperService } from "./super.service";
import { Usuario } from "../models/usuario";

@Injectable({
    providedIn:'root'
})
export class UsuarioService extends SuperService<Usuario> {
    protected model = 'usuarios';
    protected columns: (keyof Usuario)[] = [
        'name',
        'email',
        'rfc',
        'password',
        'user_type',
        'email_verified_at',
        'deleted_at',
        'created_at',
        'updated_at'
    ]

    /**
     * Crea un nuevo usuario con un rol asignado
     */
    public async createWithRole(userData: Partial<Usuario>, roleName: string): Promise<Usuario | undefined> {
        const dataWithRole = {
            ...userData,
            role: roleName
        };

        return this.new(dataWithRole);
    }

    /**
     * Obtiene usuarios con sus roles y permisos cargados
     */
    public async getUsersWithRoles(): Promise<Usuario[]> {
        return this.all(['roles', 'roles.permissions', 'permissions']);
    }

    /**
     * Obtiene un usuario con sus roles y permisos
     */
    public async getUserWithRoles(id: number): Promise<Usuario | undefined> {
        return this.find(id, ['roles', 'roles.permissions', 'permissions']);
    }
}