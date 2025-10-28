import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../generic-form/form-field/form-field.component';
import { Conditional } from '../../../controllers/super.service';
import { FormField } from '../../generic-form/form-field/form-field.component';

// Tipo que extiende FormField con propiedades de búsqueda avanzada
export type AdvancedFilter = FormField & {
  label: string;
  opWhere?: 'AND' | 'OR';
  operator?: string;
  count?: number;
  conditionals?: unknown[];
  andConditionals?: unknown[];
};

@Component({
  selector: 'app-tabla-advanced-search',
  imports: [CommonModule, FormsModule, FormFieldComponent],
  templateUrl: './tabla-advanced-search.component.html',
  styleUrl: './tabla-advanced-search.component.css'
})
export class TablaAdvancedSearchComponent {
  @Input() show = false;
  @Input() advancedSearch: AdvancedFilter[] = [];
  @Input() simpleFilteredSearch: FormField[] = [];
  @Input() creadoAntesDe: Conditional = {
    key: 'created_at',
    operator: '<',
    value: null
  };
  @Input() creadoDespuesDe: Conditional = {
    key: 'created_at',
    operator: '>',
    value: null
  };

  @Output() showChange = new EventEmitter<boolean>();
  @Output() applyFilters = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();

  onClose(): void {
    this.showChange.emit(false);
  }

  onApplyFilters(): void {
    this.applyFilters.emit();
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}