import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { CommonModule } from '@angular/common';
import { MenuOption, MenuOptionComponent } from "./menu-option/menu-option.component";
import { VersionService } from '../../services/version.service';
import { VersionComponent } from "../version/version.component";
import { Login } from '../../auth/models/login';

@Component({
  selector: 'app-sidebar-offcanvas',
  imports: [
    CommonModule,
    MenuOptionComponent,
    VersionComponent
  ],
  templateUrl: './sidebar-offcanvas.component.html',
  styleUrl: './sidebar-offcanvas.component.css'
})
export class SidebarOffcanvasComponent {
  currentRoute = '';
  user: Login | null
  menuExpanded = true
  @Input() menuOptions: MenuOption[] =[]

  logo_url = 'assets/main_logo.png'

  private router = inject(Router)
  private store = inject(LocalStorageService)
  public version = inject(VersionService)

  constructor(){
    this.user = this.store.getUser()
  }

  hasPermiso(key: string | undefined): boolean {
    if (!key || !this.user) {
      return true
    }

    return this.user.roles.some(r => r.toLowerCase().includes(key.toLowerCase()))
  }

  isCollapsed() {
    const regex = /\/(clientes|usuarios|mercancias|almacenajes|servicios)\//;
    if (regex.test(this.router.url)) {
      return true
    }
    return false
  }

  sign_out() {
    this.store.deleteUser();
    this.router.navigate(['/']);
  }

  actual_route(): string {
    return this.router.url;
  }
}
