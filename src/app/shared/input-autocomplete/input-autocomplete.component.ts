
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api/api-service.service';

@Component({
    selector: 'app-input-autocomplete',
    imports: [
    FormsModule
],
    templateUrl: './input-autocomplete.component.html',
    styleUrl: './input-autocomplete.component.css'
})
export class InputAutocompleteComponent implements OnInit, OnChanges {
  private api = inject(ApiServiceService);
  private elRef = inject(ElementRef);

  @ViewChild('noParte') noParteInput: ElementRef | undefined;
  @Input()
  list_key = ''
  @Input()
  list_key_detail = ''
  @Input()
  get_url = ''
  @Input()
  data_get: unknown = {}
  @Input()
  sm =true
  @Input()
  placeholder = ''
  @Input()
  search = false

  @Input()
  dato_input = ''
  @Output() dato_inputChange = new EventEmitter<string>()

  @Output() dato_detail_inputChange = new EventEmitter<string>()
  @Output() dato_id_inputChange = new EventEmitter<number>()
  @Output() dato_Change = new EventEmitter<unknown>()


  showAutoComplete = false
  autoCompleteSize = 1

  @Input()
  dataSource: unknown[] = []
  dataCopia: unknown[] = []
  @Input()
  list_simple = false
  @Input()
  list_detail = false

  @Output() searchChange = new EventEmitter<unknown>()

  @HostListener('document:click', ['$event'])
  handleClick(event: Event): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showAutoComplete) {
      this.showAutoComplete = false
    }
  }

  ngOnInit() {
    this.get_partes()
  }
  ngOnChanges() {
    this.autoCompleteSize= this.dataSource.length<8?this.dataSource.length:8
  }

  actualizar_dato() {
    this.showAutoComplete = false
    this.dato_inputChange.emit(this.dato_input)

    const dtRecord = this.dataSource.find((item: unknown) => {
      const itemRecord = item as Record<string, unknown>;
      return itemRecord[this.list_key] == this.dato_input
    }) as Record<string, unknown>

    if (dtRecord) {
      this.dato_detail_inputChange.emit(dtRecord[this.list_key_detail] as string)
      this.dato_id_inputChange.emit(dtRecord['id'] as number)
      this.dato_Change.emit(dtRecord)
    } else {
      const data: Record<string, unknown> = {}
      data[this.list_key] = this.dato_input
      this.dato_Change.emit(data)
    }
  }

  search_button(){
    this.buscar()
    const dato_detail = this.dataSource.find((item: unknown) => {
      const itemRecord = item as Record<string, unknown>;
      return itemRecord[this.list_key] == this.dato_input
    })
    if(dato_detail){
      this.searchChange.emit(dato_detail)
    }
  }

  get_partes() {
    if (this.get_url) {
      const dataRecord = this.data_get as Record<string, unknown>;
      dataRecord['search'] = this.dato_input
      this.api.post(this.get_url, dataRecord).subscribe((resp) => {
        if (resp.status) {
          this.dataSource = resp.data as unknown[]
          if (this.dataSource.length == 1) {
            this.dato_Change.emit(this.dataSource[0])
          } else {
            this.dato_Change.emit({})
          }
          if (this.dataSource.length < 8) {
            this.autoCompleteSize =this.dataSource.length
          } else {
            this.autoCompleteSize = 8
          }
        }
      })
    }
  }

  buscar() {
    if (this.dato_input.length % 3 == 0) {
      if (this.get_url) {
        this.get_partes()
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
      return itemRecord[this.list_key]?.toString().includes(this.dato_input)
    })
  }

  copy(data: unknown) {
    return JSON.parse(JSON.stringify(data))
  }

  // Método auxiliar para obtener valores del template
  getItemValue(item: unknown, key: string): string {
    const itemRecord = item as Record<string, unknown>;
    return itemRecord[key]?.toString() || '';
  }
  focus_input() {
    this.noParteInput?.nativeElement.focus()
  }
}
