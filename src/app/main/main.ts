import { Component, OnInit, inject } from '@angular/core';
import { SidebarOffcanvasComponent } from "../shared/sidebar-offcanvas/sidebar-offcanvas.component";
import { RouterOutlet } from '@angular/router';
import { menuUsuarioInterno } from '../core/menus/ui-menu';
import { menuUsuarioExterno } from '../core/menus/ue-menu';
import { LocalStorageService } from '../services/localStorage/local-storage.service';
import { MenuOption } from '../shared/sidebar-offcanvas/menu-option/menu-option.component';

@Component({
  selector: 'app-main',
  imports: [SidebarOffcanvasComponent, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {
  menu: MenuOption[] = [];
  private localStorageService = inject(LocalStorageService);

  ngOnInit() {
    this.loadMenuByUserType();
  }

  private loadMenuByUserType() {
    const userData = this.localStorageService.getUser();

    if (userData && userData.user) {
      switch (userData.user.user_type) {
        case 'INTERNO':
          this.menu = menuUsuarioInterno;
          break;
        case 'EXTERNO':
          this.menu = menuUsuarioExterno;
          break;
        default:
          this.menu = menuUsuarioExterno; // Menú por defecto
      }
    } else {
      // Si no hay usuario logueado, redirigir al login
      this.menu = menuUsuarioExterno;
    }
  }
}
