import { MenuOption } from "../../shared/sidebar-offcanvas/menu-option/menu-option.component";

export const menuUsuarioExterno: MenuOption[] = [
    {
        label: 'Inicio',
        tooltip: 'Página principal del portal',
        icon: 'bi-house',
        icon_fill: 'bi-house-fill',
        router_link: '/main/inicio',
        permiso: ''
    },
    {
        label: 'Mi Perfil',
        icon: 'bi-people',
        icon_fill: 'bi-people-fill',
        router_link: '/main/usuarios/editar',
        route_include: '/main/usuarios/editar',
        permiso: ''
    }
];