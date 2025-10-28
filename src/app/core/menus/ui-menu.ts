import { MenuOption } from "../../shared/sidebar-offcanvas/menu-option/menu-option.component";

export const menuUsuarioInterno: MenuOption[] = [
    {
        label: 'Inicio',
        icon: 'bi-house',
        icon_fill: 'bi-house-fill',
        router_link: '/main/inicio',
        route_include: '/main/inicio',
        permiso: '',
    },
    {
        label: 'Usuarios',
        tooltip: 'Administrar usuarios del sistema',
        icon: 'bi-people',
        icon_fill: 'bi-people-fill',
        route_include: '/main/usuarios',
        permiso: 'admin',
        sub_menu: [
            {
                label: 'Crear Usuario',
                router_link: '/main/usuarios/nuevo',
                route_include: '/main/usuarios/nuevo',
                permiso: ''
            },
            {
                label: 'Lista de Usuarios',
                router_link: '/main/usuarios/lista',
                route_include: '/main/usuarios/lista',
                permiso: ''
            }
        ]
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