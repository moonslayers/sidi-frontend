import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TablaLocalService {
  lastSort?: string
  private lastDataSource: unknown[] | null = null;
  private lastFilter: Record<string, string> | null = null;
  private lastResult: unknown[] = [];
  private filtradoCache: Record<string, unknown[]> = {}

  private cacheStackFiltered: Record<string, unknown[]> = {}

  /**
 * Map of operator strings to their corresponding comparison functions.
 */
  private operatorFunctions: Record<string, (a: unknown, b: unknown) => boolean> = {
    '=': (a, b) => a == b,
    '==': (a, b) => a === b,
    '!': (a, b) => {
      const aStr = a !== null && a !== undefined ? a.toString() : '';
      const bStr = b !== null && b !== undefined ? b.toString() : '';
      return aStr.includes(bStr);
    },
    '!=': (a, b) => a != b,
    '!==': (a, b) => a !== b,
    '<': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a < b;
      const aStr = a !== null && a !== undefined ? a.toString() : '';
      const bStr = b !== null && b !== undefined ? b.toString() : '';
      return aStr.localeCompare(bStr) < 0;
    },
    '<=': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a <= b;
      const aStr = a !== null && a !== undefined ? a.toString() : '';
      const bStr = b !== null && b !== undefined ? b.toString() : '';
      return aStr.localeCompare(bStr) <= 0;
    },
    '>': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a > b;
      const aStr = a !== null && a !== undefined ? a.toString() : '';
      const bStr = b !== null && b !== undefined ? b.toString() : '';
      return aStr.localeCompare(bStr) > 0;
    },
    '>=': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a >= b;
      const aStr = a !== null && a !== undefined ? a.toString() : '';
      const bStr = b !== null && b !== undefined ? b.toString() : '';
      return aStr.localeCompare(bStr) >= 0;
    },
  };

  private operators = ['===', '!==', '==', '!=', '<=', '>=', '!', '<', '>'];

  // Variables para el sistema de caché incremental
  private lastFilters: Record<string, string> = {};

  dataFiltered(
    dataSource: unknown[],
    filtrado: Record<string, string>
  ): unknown[] {
    // Si no hay datos, devolver vacío
    if (!dataSource.length) return [];

    // Generar clave de cache que incluye datos y filtros
    const cacheKey = this.generateCacheKey(dataSource, filtrado);

    if (this.filtradoCache[cacheKey]) {
      return this.filtradoCache[cacheKey];
    }

    // Limpiar filtros vacíos
    const activeFilters = Object.fromEntries(
      Object.entries(filtrado).filter(([, value]) => value.trim() !== '')
    );

    // Si no hay filtros activos, devolver todo el dataSource
    if (Object.keys(activeFilters).length === 0) {
      this.lastDataSource = dataSource;
      this.lastFilter = null;
      this.lastResult = dataSource;
      this.filtradoCache[cacheKey] = dataSource;
      return dataSource;
    }

    // Verificar si podemos reutilizar el último resultado
    const canReuse = this.shouldReuseCache(dataSource, activeFilters);

    let result: unknown[];
    if (canReuse) {
      const newKeys = Object.keys(activeFilters).filter(
        (k) => !this.lastFilter || this.lastFilter[k] !== activeFilters[k]
      );

      result = this.lastResult.filter((record) =>
        newKeys.every((key) => this.matchFilter(record, key, activeFilters[key]))
      );
    } else {
      // Aplicar todos los filtros desde cero
      result = dataSource;
      Object.keys(activeFilters).forEach(filtro => {
        result = this.filteredDataInCache(result, activeFilters, filtro);
      });
    }

    // Actualizar caché
    this.lastDataSource = dataSource;
    this.lastFilter = { ...activeFilters };
    this.lastResult = result;
    this.filtradoCache[cacheKey] = [...result];

    // Limpieza opcional del cache para evitar memory leaks
    this.cleanupCache();

    return result;
  }

  // Limpieza periódica del cache (opcional)
  private cleanupCache(): void {
    const keys = Object.keys(this.filtradoCache);
    if (keys.length > 100) { // Mantener máximo 100 entradas en cache
      // Eliminar las 50 más antiguas (simplificado)
      const keysToRemove = keys.slice(0, 50);
      keysToRemove.forEach(key => delete this.filtradoCache[key]);
    }
  }
  private filteredDataInCache(dataSource: unknown[], filtrado: Record<string, string>, filtro: string): unknown[] {
    const value = filtrado[filtro]
    const cache = this.cacheStackFiltered[filtro + ':' + value]
    if (cache) {
      return cache;
    }
    return dataSource.filter(row => this.matchFilter(row, filtro, value))
  }

  private shouldReuseCache(dataSource: unknown[], currentFilter: Record<string, string>): boolean {
    // No reutilizar si la fuente cambió
    if (this.lastDataSource !== dataSource) return false;
    if (!this.lastFilter) return false;

    // Verificar si el filtro actual contiene todos los del anterior + tal vez más
    return Object.keys(this.lastFilter).every((key) => {
      return currentFilter[key] === this.lastFilter![key]; // mismo valor
    });
  }

  /**
   * Limpiar caché cuando cambia el dataSource
   */
  public clearFilterCache(): void {
    this.lastDataSource = [];
    this.lastFilters = {};
    this.lastResult = [];
    this.filtradoCache = {};
    this.lastFilters = {}
    this.cacheStackFiltered = {}
  }

  // Opcional: limpiar caché manualmente
  clearCache() {
    this.filtradoCache = {}
    this.lastDataSource = null;
    this.lastFilter = null;
    this.lastResult = [];
  }

  generalSearch(dataSource: unknown[], search: string) {
    if (!dataSource.length) return;
    dataSource.forEach(r => {
      if (r && typeof r === 'object') {
        (r as Record<string, unknown>)['isHidden'] = false;
      }
    })
    if (!search) return;

    const keys = dataSource[0] && typeof dataSource[0] === 'object' ? Object.keys(dataSource[0]) : []
    dataSource.forEach(r => {
      if (r && typeof r === 'object') {
        const rowRecord = r as Record<string, unknown>;
        rowRecord['isHidden'] = !keys.some(k =>
          rowRecord[k] && rowRecord[k].toString().toLowerCase().includes(search.toLowerCase())
        );
      }
    })
  }

  public dataFilteredDebounced = this.debounce(
    (...args: unknown[]) => {
      const [dataSource, filtrado, callback] = args as [unknown[], Record<string, string>, (result: unknown[]) => void];
      const result = this.dataFiltered(dataSource, filtrado);
      callback(result);
    },
    800
  );

  sortByKey(dataSource: unknown[] = [], key: string) {
    const desc = this.lastSort == key

    dataSource.sort((a, b) => {
      if (a && typeof a === 'object' && b && typeof b === 'object') {
        const aRecord = a as Record<string, unknown>;
        const bRecord = b as Record<string, unknown>;

        if (typeof aRecord[key] == 'number' && typeof bRecord[key] == 'number') {
          return (desc ? 1 : -1) * ((aRecord[key] as number) - (bRecord[key] as number))
        }
        return (desc ? 1 : -1) * (aRecord[key]!.toString().localeCompare(bRecord[key]!.toString()))
      }
      return 0;
    })

    this.lastSort = desc ? undefined : key
  }

  totales(dataSource: unknown[], key: string): number {
    let value = dataSource[0] && typeof dataSource[0] === 'object' ?
      (dataSource[0] as Record<string, unknown>)[key] : undefined;
    if (typeof value == 'string') {
      value = value.replaceAll('$', '').replaceAll(',', '').replaceAll('%', '')
    }
    if (!this.isNumeric(value as string)) return 0;
    return dataSource.reduce((acc: number, row) => {
      if (row && typeof row === 'object') {
        const rowRecord = row as Record<string, unknown>;
        let value = rowRecord[key]
        if (typeof value == 'string') {
          value = value.replaceAll('$', '').replaceAll(',', '').replaceAll('%', '')
        }
        return acc + Number(value)
      }
      return acc;
    }, 0)
  }

  isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(+value);
  }

  // Función de debounce genérica
  private debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  public matchFilter(record: unknown, key: string, filterValue: string): boolean {
    let fieldValue: unknown;

    if (record && typeof record === 'object') {
      fieldValue = (record as Record<string, unknown>)[key];
    } else {
      fieldValue = undefined;
    }

    const trimmedValue = filterValue.trim();

    // Si el campo es nulo/undefined y no estamos buscando vacío
    if (fieldValue === null || fieldValue === undefined) {
      fieldValue = ''
    }

    // Parsear múltiples condiciones con operadores lógicos
    return this.parseMultipleConditions(fieldValue, trimmedValue);
  }

  /**
   * Detecta si hay un operador al inicio del valor de filtro
   * Los operadores deben estar ordenados de mayor a menor longitud
   * para evitar coincidencias incorrectas
   */
  private detectOperator(filterValue: string): { operator: string | null, remainingValue: string } {
    // Ordenar operadores por longitud descendente
    const sortedOperators = [...this.operators].sort((a, b) => b.length - a.length);

    for (const op of sortedOperators) {
      if (filterValue.startsWith(op)) {
        return {
          operator: op,
          remainingValue: filterValue.slice(op.length)
        };
      }
    }
    return { operator: null, remainingValue: filterValue };
  }

  /**
   * Verifica si una cadena está en formato dd/mm/yyyy
   */
  private isDateFormat(value: string): boolean {
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(value);
  }

  /**
   * Convierte una cadena en formato dd/mm/yyyy a objeto Date
   */
  private parseDate(dateStr: string): Date | null {
    if (!this.isDateFormat(dateStr)) return null;

    const [day, month, year] = dateStr.split('/').map(Number);

    // Validar que la fecha sea válida (evitar fechas como 31/02/2023)
    const date = new Date(year, month - 1, day);

    // Verificar que la fecha creada sea igual a la fecha ingresada
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }

    return null;
  }

  /**
   * Aplica comparación con operador, manejando diferentes tipos de datos
   */
  private applyComparisonWithOperator(fieldValue: unknown, filterValue: string, operator: string): boolean {
    const fieldStr = String(fieldValue).trim();
    const filterStr = filterValue.trim();

    // Verificar si ambos valores son fechas en formato dd/mm/yyyy
    const fieldDate = this.parseDate(fieldStr);
    const filterDate = this.parseDate(filterStr);

    if (fieldDate && filterDate) {
      // Ambos son fechas válidas, comparar como fechas
      return this.operatorFunctions[operator](fieldDate.getTime(), filterDate.getTime());
    }

    // Intentar convertir a número si es posible
    const numericField = Number(fieldValue);
    const numericFilter = Number(filterValue);

    // Si ambos son números válidos, comparar como números
    if (!isNaN(numericField) && !isNaN(numericFilter)) {
      return this.operatorFunctions[operator](numericField, numericFilter);
    }

    // Si no, comparar como strings
    return this.operatorFunctions[operator](fieldStr.toUpperCase(), filterStr.toUpperCase());
  }

  /**
   * Aplica operador a valores booleanos (para el caso de <VACIO>)
   */
  private applyOperator(value: boolean, expected: boolean, operator: string): boolean {
    switch (operator) {
      case '!':
      case '!=':
      case '!==':
        return value !== expected;
      case '==':
      case '===':
      default:
        return value === expected;
    }
  }

  /**
   * Parsea y evalúa múltiples condiciones con operadores lógicos
   * Soporta: | (OR) y & (AND)
   */
  private parseMultipleConditions(fieldValue: unknown, filterValue: string): boolean {
    // Si no hay operadores lógicos, usar evaluación simple
    if (!filterValue.includes('|') && !filterValue.includes('&')) {
      return this.evaluateSingleCondition(fieldValue, filterValue);
    }

    // Separar por | (OR) - división principal
    const orGroups = filterValue.split('|').map(group => group.trim());

    // Evaluar cada grupo (unidos por AND)
    return orGroups.some(andGroup => this.evaluateConditionGroup(fieldValue, andGroup));
  }

  /**
   * Evalúa un grupo de condiciones unidas por AND (&)
   */
  private evaluateConditionGroup(fieldValue: unknown, andGroup: string): boolean {
    // Separar por & (AND) dentro del grupo
    const conditions = andGroup.split('&').map(condition => condition.trim());

    // Todas las condiciones deben ser verdaderas
    return conditions.every(condition => this.evaluateSingleCondition(fieldValue, condition));
  }

  /**
   * Evalúa una condición individual usando la lógica existente
   */
  private evaluateSingleCondition(fieldValue: unknown, filterValue: string): boolean {
    const trimmedValue = filterValue.trim();

    // Detectar si hay un operador al inicio
    const operatorMatch = this.detectOperator(trimmedValue);
    const operator = operatorMatch.operator;
    const valueWithoutOperator = operatorMatch.remainingValue.trim();

    // Caso especial: <VACIO> (con o sin operador)
    if (valueWithoutOperator.toUpperCase() === '<VACIO>') {
      const isEmpty = fieldValue === null || fieldValue === undefined || fieldValue === '';
      return operator ? this.applyOperator(isEmpty, true, operator) : isEmpty;
    }

    // Si hay un operador, aplicar comparación con el operador
    if (operator) {
      return this.applyComparisonWithOperator(fieldValue, valueWithoutOperator, operator);
    }

    // Búsqueda por defecto (contains)
    const fieldStr = String(fieldValue).toLowerCase();
    const filterStr = valueWithoutOperator.toLowerCase();

    return fieldStr.includes(filterStr);
  }

  // En TablaLocalService
  private generateDataHash(dataSource: unknown[]): string {
    if (!dataSource.length) return 'empty';

    // Estrategia optimizada: usar solo metadata crítico para evitar costo alto
    const criticalInfo = {
      length: dataSource.length,
      // Usar solo los primeros 3 elementos y últimos 2 para hash rápido
      firstElements: dataSource.slice(0, 3).map(item => {
        if (item && typeof item === 'object') {
          const itemRecord = item as Record<string, unknown>;
          return Object.keys(itemRecord).slice(0, 5).map(key => `${key}:${itemRecord[key]}`).join('|');
        }
        return 'invalid-item';
      }),
      lastElements: dataSource.slice(-2).map(item => {
        if (item && typeof item === 'object') {
          const itemRecord = item as Record<string, unknown>;
          return Object.keys(itemRecord).slice(0, 5).map(key => `${key}:${itemRecord[key]}`).join('|');
        }
        return 'invalid-item';
      }),
      // Incluir estructura de campos (primer elemento)
      fields: dataSource[0] && typeof dataSource[0] === 'object' ?
        Object.keys(dataSource[0] as Record<string, unknown>).sort().join(',') : 'no-fields'
    };

    const hashString = JSON.stringify(criticalInfo);
    return this.fnv1aHash(hashString);
  }

  private generateCacheKey(dataSource: unknown[], filtrado: Record<string, string>): string {
    const dataHash = this.generateDataHash(dataSource);
    const filterHash = (JSON.stringify(Object.values(filtrado))) + "-" + dataSource.length;
    return `d-${dataHash}-f-${filterHash}`;
  }

  // En TablaLocalService - FNV-1a hash (más simple y rápido)
  private fnv1aHash(str: string): string {
    let hash = 0x811c9dc5; // FNV offset basis

    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193); // FNV prime
    }

    return (hash >>> 0).toString(36);
  }
}