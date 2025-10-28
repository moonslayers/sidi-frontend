import { Injectable } from "@angular/core";
import { SuperService } from "./super.service";
import { Role, Permission } from "../models/role";
import { StandarResponse } from "../services/api/api-service.service";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoleService extends SuperService<Role> {
    protected model = 'roles';
    protected columns: (keyof Role)[] = [
        'id',
        'name',
        'guard_name',
        'created_at',
        'updated_at'
    ];

    /**
     * Obtiene todos los roles disponibles con información detallada
     */
    public async getAllRoles(): Promise<StandarResponse<Role[]>> {
        return this.get();
    }

    /**
     * Obtiene los roles disponibles para asignar
     */
    public async getAvailableRoles(): Promise<StandarResponse<Role[]>> {
        return this.get([], [], [], {}, true);
    }

    /**
     * Obtiene los permisos de un rol específico
     */
    public async getRolePermissions(roleName: string): Promise<Permission[]> {
        const roleUrl = this.url() + '/' + roleName + '/permissions';
        const response = await firstValueFrom(this.api.get<Permission[]>(roleUrl));
        return response.data || [];
    }

    /**
     * Asigna un rol a un usuario
     */
    public async assignRoleToUser(userId: number, roleName: string): Promise<StandarResponse<unknown>> {
        const userUrl = 'api/usuarios/' + userId + '/assign-role';
        return firstValueFrom(this.api.post(userUrl, { role: roleName }));
    }

    /**
     * Obtiene los roles actuales de un usuario
     */
    public async getUserRoles(userId: number): Promise<Role[]> {
        const url = 'api/usuarios/' + userId + '/roles';
        const response = await firstValueFrom(this.api.get<Role[]>(url));
        return response.data || [];
    }
}