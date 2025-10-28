import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, OnChanges, AfterViewInit } from '@angular/core';

import { FormsModule, NgModel } from '@angular/forms';
import { InputStyle, SelectItem, Option } from '../form-field/form-field.component';
import { Validator } from '../generic-form.component';

/**
 * Componente de campo de selección personalizado que soporta:
 * - Select tradicional
 * - Autocompletado
 * - Validación básica
 * - Manejo de opciones simples y complejas
 * 
 * @example
 * // Uso básico con opciones simples:
 * <app-select-field 
 *   label="Selecciona un país"
 *   [(value)]="selectedCountry"
 *   [options]="['México', 'Estados Unidos', 'Canadá']"
 *   [defaultOption]="'México'"
 * ></app-select-field>
 * 
 * @example
 * // Uso con opciones complejas y validación:
 * <app-select-field 
 *   label="Tipo de documento"
 *   [(value)]="documentType"
 *   [options]="[
 *     { value: 'INE', label: 'Identificación oficial' },
 *     { value: 'PASSPORT', label: 'Pasaporte' },
 *     { value: 'CURP', label: 'CURP' }
 *   ]"
 *   [validator]="{ required: true }"
 *   [(valid)]="isDocumentValid"
 * ></app-select-field>
 * 
 * @example
 * // Uso con autocompletado en formulario reactivo:
 * <app-select-field
 *   label="Buscar cliente"
 *   [(value)]="clientId"
 *   [useAutocomplete]="true"
 *   [options]="clientOptions"
 *   (unknownChange)="onClientSearchChange()"
 *   [sm]="true"
 * ></app-select-field>
 * 
 * @example
 * // Uso avanzado con agrupación y estilos:
 * <div class="input-group">
 *   <app-select-field
 *     label="Moneda"
 *     [(value)]="currency"
 *     [options]="currencyOptions"
 *     [inputGroup]="true"
 *     [style]="{ 'border-radius': '0' }"
 *   ></app-select-field>
 *   <app-input-field
 *     label="Monto"
 *     [(value)]="amount"
 *     [inputGroup]="true"
 *   ></app-input-field>
 * </div>
 */
@Component({
    selector: 'app-select-field',
    imports: [
    FormsModule
],
    templateUrl: './select-field.component.html',
    styleUrl: './select-field.component.css'
})
export class SelectFieldComponent implements OnChanges, AfterViewInit {
  // Inputs
  @Input() label: string | undefined | null = ''; // Etiqueta del campo
  @Input() placeholder: string | undefined | null = null;
  @Input() value?: string | number; // Valor actual del campo
  @Output() valueChange = new EventEmitter<string | number>(); // Evento cuando cambia el valor
  @Input() validator: Validator | undefined = {}; // Validador personalizado
  @Input() sm = false; // Tamaño pequeño del campo
  @Input() options: Option[] = []; // Lista de opciones disponibles
  @Input() useAutocomplete?: boolean; // Habilita funcionalidad de autocompletado

  @Input() defaultOption?: string | number; // Opción por defecto cuando no hay valor

  @Input() valid: boolean | undefined = false; // Estado de validación
  @Output() validChange = new EventEmitter<boolean>(); // Evento cuando cambia el estado de validación

  @Output() unknownChange = new EventEmitter<boolean>(); // Evento genérico para cualquier cambio

  // Referencia al modelo del select
  @ViewChild('selectModel') selectModel!: NgModel;

  // Estilos personalizados
  @Input() style?: InputStyle;

  // Agrupación visual con otros inputs
  @Input() inputGroup? = false;

  // Mensaje de error
  errorFeedback = '';

  // Datos filtrados para autocompletado
  filteredData: string[] = [];

  showOptions = false

  
  /**
   * Maneja cambios en los inputs
   * @param changes - Objeto con los cambios detectados
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.setErrorMessage();
    }
  }

  /**
   * Configuración después de la inicialización de la vista
   */
  ngAfterViewInit() {
    this.setDefault();
    this.setIsValid();
  }

  /**
   * Establece el valor por defecto si no hay valor actual
   */
  setDefault() {
    // Si hay opción por defecto y no hay valor actual
    if (this.defaultOption && !this.value) {
      this.options.forEach((option) => {
        // Para opciones complejas (SelectItem)
        if (this.isSelectItem(option) && option.label == this.defaultOption) {
          this.value = option.value;
          this.updateValue();
        }
        // Para opciones simples (string)
        if (this.isString(option) && option == this.defaultOption) {
          this.value = this.defaultOption;
          this.updateValue();
        }
      });
    }

    // Manejo de valores nulos
    if (this.value === null) {
      this.value = undefined;
      this.updateValue();
    }
  }

  /**
   * Emite el evento de cambio de valor
   */
  updateValue() {
    this.valueChange.emit(this.value);
    this.unknownChange.emit();
  }

  /**
   * Actualiza el estado de validación
   */
  setIsValid() {
    if (!this.selectModel) return;
    this.valid = !this.getErrorMessage();
    this.validChange.emit(this.valid);
    this.unknownChange.emit();
  }

  /**
   * Establece el mensaje de error actual
   */
  setErrorMessage() {
    this.errorFeedback = this.getErrorMessage();
    this.validChange.emit((!this.errorFeedback));
    this.unknownChange.emit(true);
  }

  /**
   * Verifica si existe un error específico
   * @param errorCode - Código del error a verificar
   * @returns Booleano indicando si existe el error
   */
  hasError(errorCode: string): boolean {
    return !!this.selectModel?.errors?.[errorCode];
  }

  /**
   * Obtiene el mensaje de error correspondiente
   * @returns Mensaje de error o string vacío si no hay error
   */
  getErrorMessage(): string {
    if (this.hasError('required') && this.value === undefined) {
      return 'El campo ' + (this.label ?? '').toLowerCase() + ' es obligatorio.';
    }
    return '';
  }

  /**
   * Type guard para identificar opciones complejas (SelectItem)
   * @param option - Opción a verificar
   * @returns Booleano indicando si es SelectItem
   */
  isSelectItem(option: Option): option is SelectItem {
    return (option as SelectItem).value !== undefined;
  }

  /**
   * Type guard para identificar strings
   * @param option - Opción a verificar
   * @returns Booleano indicando si es string
   */
  isString(option: Option): option is string {
    return typeof option === 'string';
  }

  /**
   * Filtra opciones para el autocompletado
   */
  filterData() {
    const searchTerm = this.value?.toString().toLowerCase() || '';
    this.filteredData = this.options
      .filter(item =>
        (this.isSelectItem(item) && (item.label.toLowerCase().includes(searchTerm) || item.value.toString().toLowerCase().includes(searchTerm))) ||
        (item.toString().toLowerCase().includes(searchTerm))
      )
      .map(i => this.isSelectItem(i) ? i.value.toString() : i.toString())
      .slice(0, 6); // Limita a 10 resultados
  }

  /**
   * Selecciona un ítem del autocompletado
   * @param item - Ítem seleccionado
   */
  selectFilteredItem(item: string) {
    this.value = item;
    this.updateValue();
    this.filteredData = []; // Limpia los resultados filtrados
    this.showOptions= false;
  }

  /**
   * Alterna la visibilidad de las opciones en modo autocomplete
   */
  toggleOptions() {
    if (this.useAutocomplete) {
      this.showOptions = !this.showOptions;
      if (this.showOptions) {
        this.filterData();
      }
    }
  }
}