import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-empty-state',
  imports: [CommonModule],
  templateUrl: './tabla-empty-state.component.html',
  styleUrl: './tabla-empty-state.component.css'
})
export class TablaEmptyStateComponent {
  @Input() message?: string;
  @Input() showAction = false;
  @Input() actionText = 'Agregar Nuevo';
  @Input() iconClass = 'bi-inbox';

  get defaultMessage(): string {
    return this.message || 'No hay registros, la tabla está vacía.';
  }
}