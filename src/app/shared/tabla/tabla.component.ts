import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginadorComponent } from '../paginador/paginador.component';
import { Conditional, Operator, Paginator, SuperService } from '../../controllers/super.service';
import { ButtonComponent, ButtonStyle } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { FormField } from '../generic-form/form-field/form-field.component';
import { UtilsService } from '../../services/utils.service';
import { BaseModel } from '../../models/base.model';
import { TablaHeaderComponent } from "./tabla-header/tabla-header.component";
import { TablaActionsComponent } from './tabla-actions/tabla-actions.component';
import { TablaEmptyStateComponent } from './tabla-empty-state/tabla-empty-state.component';
import { TablaAdvancedSearchComponent } from './tabla-advanced-search/tabla-advanced-search.component';
import { TablaStateService } from './services/tabla-state.service';

export type TableHeader = Header | string

export interface RowButton extends Button {
  key: string;
}

export interface TableDefinition {
  style?: {
    table?: string;
    div?: string;
  },
  emptyMsg?: string;
  columns: TableHeader[]
}

export interface Header {
  header: string;
  key: string | 'row';
  subKey?: string;
  function?: (param: unknown, utils: unknown) => string | undefined | null;
  styleTdFunction?: (param: unknown, utils: unknown) => string;
  pipe?: Pipe;
  dateFormat?: string;
  keyList?: string[];
  style?: {
    td?: string;
    th?: string;
  }
}

export type Pipe = 'date' | 'uppercase' | 'lowercase' | 'currency'

export interface BarraButton {
  div?: string;
  buttons: Button[];
}

export interface Button {
  key?: string;
  text?: string;
  title?: string;
  style?: {
    div?: string;
    icon?: string;
    button?: string;
    text?: string;
  },
  event?: EventEmitter<unknown>;
}

export interface TableRow {
  isSelected?: boolean;
  isExpanded?: boolean;
  isEdit?: boolean;
  [key: string]: unknown;
}

export interface RowButtonClickEvent<T> {
  key: string;
  row: T;
}

export interface HeaderButton {
  key: string;
  style?: ButtonStyle;
  text?: string;
}

export interface RowButtons {
  style?: {
    td?: string;
    row?: string;
  }
  buttons: Button[];
}

export type AdvancedSearch = AdvancedFilter[]

export type FilteredSearch = FormField[]

export interface AdvancedConditional {
  key: string;
  operator: Operator;
  value?: string;
}

export type AdvancedFilter = FormField & {
  label: string;
  key?: string;
  inputGroup?: boolean;
  opWhere?: 'AND' | 'OR';
  operator?: Operator;
  count?: number;
  conditionals?: AdvancedConditional[];
  andConditionals?: AdvancedConditional[];
};

export interface AdvancedSearchFilter {
  relation: string;
  operator?: Operator,
  opWhere?: boolean;
  count?: number;
  conditionals: unknown[][];
  andConditionals: unknown[][];
}

export interface Sorting {
  column: string;
  desc?: boolean | null;
}

@Component({
  selector: 'app-tabla',
  imports: [
    CommonModule,
    FormsModule,
    PaginadorComponent,
    ButtonComponent,
    TitlecasePipe,
    TablaHeaderComponent,
    TablaActionsComponent,
    TablaEmptyStateComponent,
    TablaAdvancedSearchComponent
  ],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css'
})

export class TablaComponent<T extends BaseModel> implements OnInit, OnChanges {
  @Input() title?: string
  @Input() titleStyle?: {
    div?: string;
    title: string;
  }
  /** Controller to fetch data, must be extend of SuperService */
  @Input() controller !: SuperService<T> 
  /** Include in rows object related in server */
  @Input() relations: string[] = []
  /** Buttons to be added in upper bar */
  @Input() barraButtons: HeaderButton[] = []

  @Input() useClickedStyleOnHeaderButton = true

  /** determines is the table starts empty or not  */
  @Input() startEmpty = false

  /**Ultimo key del ultimo boton de la barra clickead */
  lastHeaderButtonClicked = ''

  @Input() showAdvancedButton = true
  @Input() advancedSearch: AdvancedSearch = []
  showAdvancedSearch = false
  /** Emits the button key of barraButtons button */
  @Output() barraButtonClickEvent = new EventEmitter<string>()
  @Input() divBarraButtons = 'row justify-content-end mb-2'
  /** If true show agregar button */
  @Input() agregar = true
  /** If true show bar buttons */
  @Input() showBarraButtons = true
  /** if true redirect when usen agregar button or edit button */
  @Input() useDefaultAgregarRedirect = true
  @Input() agregarRedirectRoute = '../nuevo'
  @Input() agregarButton: Button = {
    text: 'Nuevo',
    style: {
      icon: "bi bi-plus-circle-fill ms-1",
      button: "btn btn btn-secondary shadow text-bold scale-05",
      div: 'col-auto p-1',
    },
  }
  /** If you not using default redirect, you can use agregar event */
  @Output() agregarClick = new EventEmitter<void>()
  /** if true shows eliminar button in bar button */
  @Input() eliminar = true
  @Input() eliminarButton: Button = {
    key: 'eliminar',
    text: 'Eliminar',
    style: {
      icon: "bi bi-trash-fill ms-1",
      button: "btn btn btn-danger shadow text-bold scale-05",
      div: 'col-auto p-1',
    },
  }
  /** if true shows restaurar button in buttons bar */
  @Input() restaurar = true
  @Input() restaurarButton: Button = {
    key: 'restaurar',
    text: 'Restaurar',
    style: {
      icon: "bi bi-arrow-counterclockwise ms-1",
      button: "btn btn btn-success shadow text-bold scale-05",
      div: 'col-auto p-1',
    },
  }
  @Output() eliminarClick = new EventEmitter<void>()
  @Input() activos = true
  @Input() activosButton: Button = {
    key: 'activos',
    text: 'Activos',
    style: {
      icon: "bi bi-folder-check ms-1",
      button: "btn btn btn-info shadow text-bold scale-05",
      div: 'col-auto p-1',
    }
  }
  @Output() activosClick = new EventEmitter<void>()
  @Input() eliminados = true
  @Input() eliminadosButton: Button = {
    key: 'eliminados',
    text: 'Eliminados',
    style: {
      icon: "bi bi-folder-x ms-1",
      button: "btn btn btn-warning shadow text-bold scale-05",
      div: 'col-auto p-1',
    }
  }
  @Output() eliminadosClick = new EventEmitter<void>()
  @Input() advancedSearchButton: Button = {
    style: {
      icon: "bi bi-filter-circle-fill",
      button: "btn btn btn-primary shadow scale-05",
      div: 'col-auto p-1',
    }
  }

  @Input() simpleFilteredSearch: FilteredSearch = []
  @Input() rowButtons: RowButton[] = []
  @Output() rowButtonClickEvent = new EventEmitter<RowButtonClickEvent<T>>()
  @Input() rowButtonsStyle: {
    td?: string;
    div?: string;
  } | undefined
  @Input() useDefaultRowEditRedirect = true
  @Input() rowEditar = true
  @Input() useRelative = true
  @Input() rowEditarRoute = '../editar'
  @Input() idKey = 'id'
  @Input() rowEditarButton: Button = {
    style: {
      button: 'btn btn-sm btn-success scale-05',
      icon: 'bi bi-pencil-fill'
    },
  }
  @Input() rowEditarEliminadoButton: Button = {
    style: {
      button: 'btn btn-sm btn-info scale-05',
      icon: 'bi bi-eye-fill'
    },
  }
  @Output() rowEditarClick = new EventEmitter<T>()
  @Input() rowEliminar = true
  @Input() rowEliminarButton: Button = {
    style: {
      button: 'btn btn-sm btn-danger scale-05',
      icon: 'bi bi-trash-fill'
    },
  }
  @Input() rowRestaurarButton: Button = {
    style: {
      button: 'btn btn-sm btn-success scale-05',
      icon: 'bi bi-arrow-counterclockwise'
    },
  }
  /** if true, SuperService controller will be use to delete row item */
  @Input() useGenericDelete = true
  @Output() rowEliminarClick = new EventEmitter<T>()
  @Input() tableDefinition: TableDefinition = {
    style: {},
    columns: []
  }
  @Input() paginador: Paginator = {
    per_page: 10,
    page: 1
  }
  @Input() barraBusqueda = true
  /** activate detailed mode, show data when user click on row */
  @Input() isDetailed = false
  @Input() detailedDefinition: TableHeader[] = []
  @Input() checkbox = true
  /** dateformat for date pipe */
  @Input() defaultDateFormat = 'dd/MM/yyyy'
  /** conditionals to be add in api get */
  params: Conditional[] = []

  /** extra data to be included in every get data */
  @Input() getConditionals: Conditional[] = [
    {
      key: 'deleted_at',
      operator: 'IS NULL',
      value: null
    },
  ]

  @Input() getAdvancedFilters: AdvancedSearchFilter[] = []

  @Input() getExtra?: Record<string, unknown> = undefined

  @Output() filtrosLimpios = new EventEmitter()

  @Input() incluirEliminados = false

  @Input() selected = 0

  @Input() selectedIds: Record<number,boolean> = {}

  @Input() expandedIds: Record<number,boolean> = {}

  @Input() selectedRows: T[] = []

  @Output() selectedRowsChange = new EventEmitter<T[]>()

  checkboxAll = false

  creadoAntesDe: Conditional = {
    key: 'created_at',
    operator: '<',
    value: null
  }

  creadoDespuesDe: Conditional = {
    key: 'created_at',
    operator: '>',
    value: null
  }

  stringSearch = ''
  dataSource: T[] = []
  isunknownExpanded = false
  total_pages = 0
  total_items = 0

  @Input() sort: Sorting = {
    column: 'created_at',
    desc: true,
  }

  /** para saber si estamos viendo activos o eliminados */
  status = true

  //services
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  public utils = inject(UtilsService)
  private stateService = inject(TablaStateService)

  ngOnInit() {
    if (this.startEmpty) return
    if (this.getExtra) return
    this.verActivos()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['getConditionals'] || changes['getExtra'] || changes['getAdvancedFilters']) {
      this.getData()
    }
    if (changes['advancedSearch'] && this.advancedSearch.length > 0) {
      this.advancedSearch.forEach((field) => {
        field.inputGroup = true
      })
    }
  }

  agregarEvent() {
    this.agregarClick.emit()
    if (this.useDefaultAgregarRedirect) {
      this.router.navigate([this.agregarRedirectRoute], { relativeTo: this.route })
    }
  }

  editEvent(row: (T | BaseModel) & TableRow) {
    const typedRow = row as TableRow;
    this.rowEditarClick.emit(row as T)
    if (this.useDefaultRowEditRedirect) {
      if (this.useRelative) {
        this.router.navigate([this.rowEditarRoute + '/' + typedRow[this.idKey]], { relativeTo: this.route })

      } else {
        this.router.navigate([this.rowEditarRoute + '/' + typedRow[this.idKey]])
      }
    }
  }

  public limpiarFiltros() {
    this.paginador.page = 1
    this.advancedSearch.forEach((filter) => filter.value = undefined)
    this.simpleFilteredSearch.forEach((filter) => filter.value = undefined)
    this.creadoAntesDe.value = null
    this.creadoDespuesDe.value = null
    this.filtrosLimpios.emit()
    this.getData()
  }

  public applyFilters() {
    this.paginador.page = 1
    this.getData()
  }

  public async getData() {
    if (this.startEmpty) {
      this.startEmpty = false
      return
    }
    let busquedaAvanzada = this.generarBusquedaAvanzadaData()
    if (busquedaAvanzada == '[]') busquedaAvanzada = (this.getExtra?.['busqueda_avanzada'] ?? '[]').toString()

    const extraData = {
      ...this.getExtra,
      search: this.stringSearch,
      busqueda_avanzada: busquedaAvanzada,
      sort: JSON.stringify(this.sort),
    }
    const conditionals: Conditional[] = [...this.params, ...this.getConditionals]
    if (this.creadoAntesDe.value) conditionals.push(this.creadoAntesDe)
    if (this.creadoDespuesDe.value) conditionals.push(this.creadoDespuesDe)

    this.simpleFilteredSearch
      .filter(filter => filter.value !== undefined)
      .forEach((filter) => {
        conditionals.push({
          key: filter.key,
          operator: '=',
          value: filter.value!
        })
      })
    const res = await this.controller!.get(
      conditionals,
      this.paginador,
      this.relations,
      extraData,
    )


    this.dataSource = res.data ?? []
    this.total_pages = res.total_pages ?? 0
    this.total_items = res.total_items ?? 0
    this.checkColumns()
    this.showAdvancedSearch = false
  }

  private generarBusquedaAvanzadaData() {
    const data: AdvancedSearchFilter[] = []
    //primero aplicamos la busqueda avanzada de los filtros
    this.advancedSearch
      .filter((filtro) => filtro.value !== undefined && filtro.value !== '')
      .forEach((filtro) => {
        data.push({
          relation: filtro.key,
          operator: filtro.operator,
          count: filtro.count,
          conditionals:
            (filtro.conditionals ?? []).map((cond) => [cond.key, cond.operator, (cond.value ?? filtro.value!)]),
          andConditionals:
            (filtro.andConditionals ?? []).map((cond) => [cond.key, cond.operator, (cond.value ?? filtro.value!)]),
        })
      })
    //despues agregamos los filtros definidos en la tabla de forma predeterminada
    this.getAdvancedFilters.forEach((filtro) => data.push(filtro))

    console.log(data)

    return JSON.stringify(data)
  }

  /**
   * initialize tableDefinition if it's undefined
   */
  checkColumns() {
    if (this.tableDefinition.columns.length == 0 && this.dataSource.length > 0) {
      this.tableDefinition.columns = Object.keys(this.dataSource[0])
        .filter((key: string) => !['isSelected', 'isExpanded'].includes(key))
    }
    this.detailedDefinition = this.copy(this.tableDefinition.columns)

    if (this.incluirEliminados) {
      this.addColumn('deleted_at')
    }
  }

  async verActivos() {
    if (!this.incluirEliminados) {
      this.removeConditional('deleted_at')
      this.addConditional({
        key: 'deleted_at',
        operator: 'IS NULL',
        value: null
      })
    }
    this.paginador.page = 1
    this.status = true
    await this.getData()
    this.removeColumn('deleted_at')
  }

  selectRow(row: T) {
    const selectedBoolean = this.selectedIds[row.id]
    this.selectedIds[row.id] = !selectedBoolean
    this.selected += !selectedBoolean ? 1 : -1
    this.updateSelectedRows()
  }

  private updateSelectedRows() {
    this.selectedRows = this.dataSource.filter(row => this.selectedIds[row.id])
    this.selectedRowsChange.emit(this.selectedRows)
  }

  async verEliminados() {
    this.removeConditional('deleted_at')
    this.addConditional({
      key: 'deleted_at',
      operator: 'IS NOT NULL',
      value: null
    })
    this.paginador.page = 1
    this.status = false
    await this.getData()
    this.addColumn('deleted_at')
  }

  async genericDelete(row: T | BaseModel) {
    const typedRow = row as T;
    const rowId = typedRow[this.idKey as keyof T]
    if (rowId && typeof rowId === 'number' && this.useGenericDelete) {
      await this.controller?.switch(rowId)
      this.getData()
      return
    }
    this.rowEliminarClick.emit(typedRow)
  }

  async genericDeleteMultiple() {
    if (this.useGenericDelete) {
      for (const row of this.dataSource.filter((row) => this.selectedIds[row.id] )) {
        const rowId = (row as Record<string, unknown>)[this.idKey]
        if (rowId && typeof rowId === 'number') {
          await this.controller?.switch(rowId)
        }
      }
      this.getData()
    }
  }

  copy(data: unknown) {
    return JSON.parse(JSON.stringify(data))
  }

  buscar() {
    this.paginador.page = 1
    this.getData()
  }

  isHeader(header: TableHeader): header is Header {
    return (header as Header).key !== undefined
  }

  isString(header: TableHeader): header is string {
    return typeof header === 'string';
  }

  checkAll() {
    this.dataSource.forEach((row) => this.selectedIds[row.id] = this.checkboxAll)
    this.selected = this.checkboxAll ? this.dataSource.length : 0
    this.updateSelectedRows()
  }

  defaultResponsiveClass(index: number): string {
    const classes = ["d-sm-table-cell", "d-none d-sm-table-cell", "d-none d-md-table-cell", "d-none d-lg-table-cell", "d-none d-xl-table-cell"]
    return classes[index] ?? 'd-none d-xl-table-cell'
  }

  private addConditional(cond: Conditional): void {
    const exists = this.getConditionals.some((conditional) => conditional.key == cond.key);

    if (!exists) {
      this.getConditionals.push(cond);
    }
  }

  private removeConditional(key: string): void {
    const find = this.getConditionals.find((conditional) => conditional.key == key);

    if (find) {
      this.getConditionals.splice(this.getConditionals.indexOf(find), 1)
    }
  }

  /**
 * Agrega una columna al arreglo `tableDefinition.columns` si no existe ya.
 * Si `column` es un objeto de tipo `Header`, verifica la existencia mediante su propiedad `key`.
 * Si `column` es un `string`, se compara directamente.
 *
 * @param column La columna que se desea agregar. Puede ser un objeto `Header` o un `string`.
 */
  private addColumn(column: TableHeader): void {
    const exists = this.tableDefinition.columns.some((header) => {
      if (this.isHeader(header) && this.isHeader(column)) {
        return header.key === column.key; // Comparación por `key` si ambos son `Header`.
      }
      return header === column; // Comparación directa si son strings.
    });

    if (!exists) {
      this.tableDefinition.columns.push(column);
    }
  }

  /**
   * Elimina una columna del arreglo `tableDefinition.columns` si existe.
   * Si `column` es un objeto de tipo `Header`, elimina la columna coincidente por su propiedad `key`.
   * Si `column` es un `string`, elimina la coincidencia directa.
   *
   * @param column La columna que se desea eliminar. Puede ser un objeto `Header` o un `string`.
   */
  private removeColumn(column: TableHeader): void {
    const index = this.tableDefinition.columns.findIndex((header) => {
      if (this.isHeader(header) && this.isHeader(column)) {
        return header.key === column.key; // Comparación por `key` si ambos son `Header`.
      }
      return header === column; // Comparación directa si son strings.
    });

    if (index > -1) {
      this.tableDefinition.columns.splice(index, 1);
    }
  }

  addParam(param: Conditional) {
    if (param.key == 'deteled_at') return
    const find = this.params.find((item) => item.key == param.key)
    if (!find) {
      this.params.push(param)
    } else {
      find.operator = param.operator
      find.value = param.value
    }
  }

  rowValue(row: unknown, header: Header): string | undefined | null {
    if (typeof row !== 'object' || row === null) return null;

    const rowRecord = row as Record<string, unknown>;
    if (header.subKey && typeof rowRecord[header.key] === 'object' && rowRecord[header.key] !== null && !Array.isArray(rowRecord[header.key]) && header.subKey in (rowRecord[header.key] as Record<string, unknown>)) {
      return (rowRecord[header.key] as Record<string, unknown>)[header.subKey] as string
    }
    // Si existe una función personalizada en el header
    if (header.function) {
      const value = header.key === 'row' ? row : rowRecord[header.key];
      // Verificamos que la función se pueda aplicar al valor
      if (value !== undefined) {
        return header.function(value, this.utils);
      }
      return undefined;
    }
    if (header.keyList && header.keyList.length > 0 && rowRecord[header.key]) {
      let value: unknown = rowRecord[header.key]
      for (const key of header.keyList) {
        if (value && typeof value === 'object' && key in value) {
          value = (value as Record<string, unknown>)[key]
        }
      }
      if (typeof value === 'string') {
        return value
      }
      return undefined
    }
    const rowValue = rowRecord[header.key]
    return typeof rowValue === 'string' ? rowValue : undefined
  }

  // Método auxiliar para obtener valores de forma segura desde el template
  getRowValue(row: T | BaseModel, key: string): unknown {
    const rowRecord = row as Record<string, unknown>;
    return rowRecord[key];
  }

  // Método auxiliar para obtener valor como Date para el pipe
  getRowValueAsDate(row: T | BaseModel, key: string): Date | string | null {
    const value = this.getRowValue(row, key);
    if (this.utils.isISODateString(value as string)) {
      return new Date(value as string);
    }
    return null;
  }

  // Método auxiliar para manejar el evento selectRow de forma segura
  onSelectRow(row: T | BaseModel) {
    const typedRow = row as T;
    this.selectRow(typedRow);
  }

  // Método auxiliar para manejar el evento rowButtonClick de forma segura
  onRowButtonClick(buttonKey: string, row: T | BaseModel) {
    const typedRow = row as T;
    this.rowButtonClickEvent.emit({key: buttonKey, row: typedRow});
  }

  // Método auxiliar para validar si un valor es fecha ISO
  isISODateValue(value: unknown): boolean {
    return this.utils.isISODateString(value as string);
  }

  expand(row: T | BaseModel) {
    if (this.detailedDefinition.length == 0 || !this.isDetailed) return

    if (this.dataSource.some((row2) => this.expandedIds[row.id] && !this.expandedIds[row2.id])) {
      this.dataSource.forEach((row2) => this.expandedIds[row2.id] = false)
    }
    this.expandedIds[row.id] = !this.expandedIds[row.id]
    if (this.expandedIds[row.id]) {
      this.isunknownExpanded = true
    } else {
      this.isunknownExpanded = false
    }
  }
}
