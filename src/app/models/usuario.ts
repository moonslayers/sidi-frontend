import { BaseModel } from "./base.model";
import { Role, Permission } from "./role";

export interface Usuario extends BaseModel {
    rfc: string;
    user_type: 'INTERNO' | 'EXTERNO';
    name: string;
    email: string;
    email_verified_at?: string;
    password?: string; // Campo opcional, requerido solo para nuevos usuarios
    roles?: Role[];
    permissions?: Permission[];
}