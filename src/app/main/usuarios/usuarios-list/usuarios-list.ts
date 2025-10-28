import { Component, inject } from '@angular/core';
import { TablaComponent } from "../../../shared/tabla/tabla.component";
import { UsuarioService } from '../../../controllers/usuario.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [TablaComponent],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css'
})
export class UsuariosList {
  public usuarioController = inject(UsuarioService)
}
