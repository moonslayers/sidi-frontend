import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarOffcanvasComponent } from "../../shared/sidebar-offcanvas/sidebar-offcanvas.component";


@Component({
  selector: 'app-formulario-inhibidores',
  standalone: true,
  imports: [RouterOutlet, SidebarOffcanvasComponent],
  templateUrl: './formulario-inhibidores.html'  
})
export class FormularioInhibidores {
  
}
