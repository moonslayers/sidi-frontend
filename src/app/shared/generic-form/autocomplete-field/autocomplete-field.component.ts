import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild, inject, OnChanges, AfterViewInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ApiServiceService } from '../../../services/api/api-service.service';
import { firstValueFrom } from 'rxjs';
import { Validator } from '../generic-form.component';
import { TitlecasePipe } from '../../../pipes/titlecase.pipe';
import { CacheService } from '../../../services/cache.service';

export interface AutoCompleteField {
  label?: string;
  placeholder?: string;
  key: string;
  value?: number;
  keyList: string;
  keyDetalle?: string;
  apiUrl: string;
  extraData?: Record<string, unknown>;
  nuevoRedirect?: string;
  valid?: boolean;
  validator?: Validator
  style?: AutoCompleteStyle;
  inputGroup?: boolean;
  function?: (row: unknown) => string;
  keyListList?: string[];
  keyListDetalle?: string[];
  type?: 'autocomplete';
}

export interface AutoCompleteStyle {
  label?: string;
  div?: string;
  input?: string;
}

@Component({
    selector: 'app-autocomplete-field',
    imports: [
        CommonModule,
        FormsModule,
        TitlecasePipe,
    ],
    templateUrl: './autocomplete-field.component.html',
    styleUrl: './autocomplete-field.component.css'
})
export class AutocompleteFieldComponent implements OnChanges, AfterViewInit {
  private api = inject(ApiServiceService);
  private elRef = inject(ElementRef);
  private cache = inject(CacheService);

  @ViewChild('noParte') noParteInput: ElementRef | undefined;
  @Input() keyList = 'id'
  @Input() keyListList?: string[] = []
  @Input() keyListDetalle?: string[] = []
  @Input() keyDetalle? = 'nombre'
  @Input() apiUrl = ''
  @Input() extraData: Record<string, unknown> = {
    conditionals: JSON.stringify([['deleted_at', 'IS NULL', null]])
  }
  @Input() style?: AutoCompleteStyle
  @Input() sm = false
  @Input() label?: string;
  @Input() placeholder?: string
  @Input() showDetalle = true
  @Input() nuevoRedirect?: string
  @Input() inputGroup? = false
  @Input() validator?: Validator

  errorFeedBack = ''

  @Input() valueInput = ''
  @Output() valueInputChange = new EventEmitter<string>()

  @Input() value?: number | string | null
  @Output() valueChange = new EventEmitter<number | string | null>()

  @Input() valid? = true
  @Output() validChange = new EventEmitter<boolean>()
  @Output() unknownChange = new EventEmitter<void>()

  @ViewChild('inputModel') inputModel!: NgModel

  @Input() relations?: string[] = []

  @Input() function?: (row: unknown) => string

  @Input() simpleSelect = false

  @Input() expandedSelect = true

  @Input() disabled = false

  showAutoComplete = false
  autoCompleteSize = 1

  getKeys: string[] = []

  @Input()
  dataSource: unknown[] = []
  dataCopia: unknown[] = []

  @HostListener('document:click', ['$event'])
  handleClick(event: Event): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showAutoComplete) {
      this.showAutoComplete = false
    }
  }

  async showAutoCompleteList() {
    if (this.dataSource.length == 0) {
      await this.getDataSource()
    }
    this.showAutoComplete = true
  }

  listFromNumber(n: number) {
    return [...Array(n + 1).keys()];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.adjustAutoCompleteSize()
    if (changes['value'] && this.value !== changes['value'].previousValue && this.value) {
      this.onOptionSelected()
    }
    if (changes['extraData']) {
      //this.getDataSource()
    }
  }
  keyListValue(row: unknown) {
    if (!this.keyListList || (this.keyListList ?? []).length == 0) return ''
    const rowRecord = row as Record<string, unknown>;
    let value = ''
    for (const key of this.keyListList) {
      if (rowRecord[key]) {
        value += ' ' + rowRecord[key]
      }
    }
    return value
  }

  ngAfterViewInit() {
    this.setIsValid()
  }

  setIsValid() {
    this.setErrorFeedBack()
    this.valid = this.validator?.required ? !!this.value : true
    this.validChange.emit(this.valid)
  }

  setErrorFeedBack() {
    if (this.validator?.required && this.inputModel.touched && !this.value) {
      this.errorFeedBack = 'El campo ' + this.label?.toLowerCase() + ' es obligatorio'
    }
  }

  findOption() {
    return this.dataSource.find((item) => {
      const itemRecord = item as Record<string, unknown>;
      return itemRecord[this.keyList] == this.value
    })
  }

  async onOptionSelected(valueSelected?: unknown) {
    if (valueSelected && valueSelected == this.value) return
    if (valueSelected) {
      this.value = valueSelected as string | number | null
      this.valueChange.emit(this.value)
    }

    if (!valueSelected) {
      valueSelected = this.value
    }

    if (this.value == 'nuevo' && this.nuevoRedirect) {
      window.open('/#/' + this.nuevoRedirect, '_blank')
      return
    }
    if (!this.dataSource.length) {
      await this.getDataSource()
    }
    let find = this.findOption()
    if (!find) {
      find = (await firstValueFrom(this.api.get(this.apiUrl + '/' + this.value, {}, false))).data
    }
    if (!find) {
      return
    }
    this.showAutoComplete = false
    const findRecord = find as Record<string, unknown>;
    this.valueInput = (findRecord[this.keyDetalle ?? 'nombre'] ?? findRecord[this.keyList]) as string
    if (this.function) {
      this.valueInput = this.function(find)
    }
    this.valueInputChange.emit(this.valueInput)
    this.setIsValid()
    this.unknownChange.emit()
  }

  search_button() {
    this.buscar()
  }

  adjustAutoCompleteSize() {
    this.autoCompleteSize = this.dataSource.length < 8 ? this.dataSource.length : 8
    this.autoCompleteSize = this.autoCompleteSize > 0 ? this.autoCompleteSize : 1
    if (this.nuevoRedirect) {
      this.autoCompleteSize++
    }
  }

  async getDataSource() {
    if (this.apiUrl) {
      const data = {
        search: this.valueInput,
        ...this.extraData,
        relations: JSON.stringify(this.relations)
      }
      this.dataSource = ((await firstValueFrom(this.api.get<unknown>(this.apiUrl, data, false))).data as unknown[]) ?? []
      if (this.getKeys.length == 0 && this.dataSource[0]) {
        this.getKeys = Object.keys(this.dataSource[0])
      }
      this.unknownChange.emit()
      this.adjustAutoCompleteSize()
    }
  }

  buscar() {
    this.valueChange.emit(null)
    if (this.valueInput.length % 3 == 0) {
      if (this.apiUrl) {
        this.getDataSource()
      } else {
        this.busqueda_local()
      }
    }
  }

  busqueda_local() {
    if (this.dataCopia.length === 0) {
      this.dataCopia = this.copy(this.dataSource)
    }
    this.dataSource = this.dataCopia.filter((item: unknown) => {
      const itemRecord = item as Record<string, unknown>;
      return itemRecord[this.keyList]?.toString().includes(this.valueInput)
    })
  }

  copy(data: unknown) {
    return JSON.parse(JSON.stringify(data))
  }

  // Método auxiliar para obtener valores de forma segura desde el template
  getItemValue(item: unknown, key: string): string {
    const itemRecord = item as Record<string, unknown>;
    return itemRecord[key]?.toString() || '';
  }

  // Método auxiliar para verificar si un objeto tiene una propiedad
  hasProperty(item: unknown, key: string): boolean {
    if(!item) return false;
    const itemRecord = item as Record<string, unknown>;
    return itemRecord[key] !== undefined && itemRecord[key] !== null;
  }
  focus_input() {
    this.noParteInput?.nativeElement.focus()
  }
}
