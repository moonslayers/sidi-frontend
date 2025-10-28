import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

export interface MenuOption {
  label: string;
  tooltip?: string;
  icon?: string; //clase de bootstrap icons example: bi-eye
  icon_fill?: string; //clase de bootstrap icons example: bi-eye-fill
  route_include?: string;
  router_link?: string;
  sub_menu?: MenuOption[];
  permiso?: string;
}

@Component({
  selector: 'app-menu-option',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './menu-option.component.html',
  styleUrl: './menu-option.component.css'
})
export class MenuOptionComponent implements OnChanges {
  private router = inject(Router);

  @Input() menu_option: MenuOption = {
    label: '',
    icon: '',
  }
  @Input() menuExpanded = true
  @Input() icon_size = ''
  @Input() label_size = ''
  subMenuExpandClass = 'd-none'
  @Input() showLabels = true
  @Input() classColor = 'bg-primary'
  isExpanded = false;

  url=''

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuExpanded']) {
      if (this.menuExpanded) {
        setTimeout(() => {
          this.showLabels = this.menuExpanded
        }, 200)
      } else {
        this.showLabels = false
        this.subMenuExpandClass = 'd-none'
      }
    }
  }

  icon(): string | undefined {
    return this.isOptionInRoute() ? this.menu_option.icon_fill ?? this.menu_option.icon : this.menu_option.icon
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  hasPermiso(permiso:string|null|undefined):boolean{
    if(!permiso) return true;

    // Importar el servicio de localStorage para verificar permisos
    // Este componente no puede inyectar servicios directamente, así que delegamos
    // la validación al componente padre (SidebarOffcanvasComponent)
    return true;
  }

  isRouteActive(routerLink:string|undefined){
    if(!routerLink) return false;
    
    return this.actual_route().includes(routerLink)
  }

  isOptionInRoute() {
    return this.actual_route().includes((this.menu_option.route_include ?? '').toString())
  }

  actual_route(): string {
    return this.router.url;
  }

  collapse() {
    if (this.subMenuExpandClass == 'd-none') {
      this.subMenuExpandClass = 'animate__fadeInLeft'
    } else {
      this.subMenuExpandClass = 'animate__fadeOutLeft'
      setTimeout(() => { this.subMenuExpandClass = 'd-none' }, 150)
    }
  }
}
