import { Usuario } from "../../models/usuario"

export interface Login {
    message: string;
    user: Usuario;
    roles: string[];
    permissions: string[];
    token: string;
    token_type: string;
    expires_at: Date,
    expires_in_minutes: number;
}