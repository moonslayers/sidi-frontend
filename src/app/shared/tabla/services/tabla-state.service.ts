import { Injectable, signal } from '@angular/core';
import { Conditional } from '../../../controllers/super.service';

export interface Sorting {
  column: string;
  desc?: boolean | null;
}

export interface TableRow {
  isSelected?: boolean;
  isExpanded?: boolean;
  isEdit?: boolean;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class TablaStateService {
  // Estado de la tabla
  public selectedCount = signal(0);
  public selectedRows = signal<TableRow[]>([]);
  public checkboxAll = signal(false);
  public isunknownExpanded = signal(false);

  // Estado de navegación
  public currentSort = signal<Sorting>({ column: 'created_at', desc: true });
  public currentPage = signal(1);
  public itemsPerPage = signal(10);

  // Estado de filtros
  public searchQuery = signal('');
  public activeFilters = signal<Conditional[]>([]);
  public status = signal(true); // true=activos, false=eliminados

  // Estado de UI
  public showAdvancedSearch = signal(false);
  public isLoading = signal(false);

  // Métodos para gestión de selección
  updateSelectedCount(count: number): void {
    this.selectedCount.set(count);
  }

  updateSelectedRows(rows: TableRow[]): void {
    this.selectedRows.set(rows);
  }

  updateCheckboxAll(checked: boolean): void {
    this.checkboxAll.set(checked);
  }

  toggleRowSelection(row: TableRow): void {
    const currentRows = this.selectedRows();
    const isSelected = row.isSelected;

    if (isSelected) {
      row.isSelected = false;
      const updatedRows = currentRows.filter(r => r !== row);
      this.updateSelectedRows(updatedRows);
      this.updateSelectedCount(updatedRows.length);
    } else {
      row.isSelected = true;
      const updatedRows = [...currentRows, row];
      this.updateSelectedRows(updatedRows);
      this.updateSelectedCount(updatedRows.length);
    }
  }

  selectAllRows(rows: TableRow[], checked: boolean): void {
    rows.forEach(row => {
      row.isSelected = checked;
    });
    this.updateCheckboxAll(checked);
    this.updateSelectedRows(checked ? rows : []);
    this.updateSelectedCount(checked ? rows.length : 0);
  }

  // Métodos para gestión de expansión
  toggleRowExpansion(row: TableRow, allRows: TableRow[]): void {
    // Si ya hay una fila expandida y esta no es la actual, colapsar todas
    if (this.isunknownExpanded() && !row.isExpanded && allRows.some(r => r.isExpanded)) {
      allRows.forEach(r => r.isExpanded = false);
    }

    row.isExpanded = !row.isExpanded;
    this.isunknownExpanded.set(row.isExpanded);
  }

  // Métodos para gestión de ordenamiento
  updateSorting(sort: Sorting): void {
    this.currentSort.set(sort);
  }

  // Métodos para gestión de paginación
  updatePagination(page: number, perPage: number): void {
    this.currentPage.set(page);
    this.itemsPerPage.set(perPage);
  }

  // Métodos para gestión de filtros
  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Resetear a primera página
  }

  updateActiveFilters(filters: Conditional[]): void {
    this.activeFilters.set(filters);
    this.currentPage.set(1); // Resetear a primera página
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeFilters.set([]);
    this.currentPage.set(1);
  }

  // Métodos para gestión de estado
  updateStatus(active: boolean): void {
    this.status.set(active);
    this.currentPage.set(1);
  }

  // Métodos para gestión de UI
  toggleAdvancedSearch(show: boolean): void {
    this.showAdvancedSearch.set(show);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  // Método para resetear todo el estado
  resetState(): void {
    this.selectedCount.set(0);
    this.selectedRows.set([]);
    this.checkboxAll.set(false);
    this.isunknownExpanded.set(false);
    this.currentSort.set({ column: 'created_at', desc: true });
    this.currentPage.set(1);
    this.searchQuery.set('');
    this.activeFilters.set([]);
    this.status.set(true);
    this.showAdvancedSearch.set(false);
    this.isLoading.set(false);
  }
}