import { inject, Injectable } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Observable, map } from "rxjs";
import { LocalStorageService } from "./localStorage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private route = inject(ActivatedRoute)
  private sanitizer = inject(DomSanitizer)
  private storage = inject(LocalStorageService)
  private sanatizer = inject(DomSanitizer)

  copyOf(value: object | unknown) {
    return JSON.parse(JSON.stringify(value) ?? '{}')
  }

  /**
   * Retrieves the `id` parameter from the URL's paramMap as an `Observable`.
   * If the `id` is not present or is not a valid number, returns `undefined`.
   *
   * @returns An `Observable<number | undefined>` containing the parsed `id` or `undefined`.
   */
  idFromParams(key = 'id'): Observable<number | undefined> {
    return this.route.paramMap.pipe(
      map((params) => {
        const id = params.get(key);
        return this.parseNumberOrUndefined(id);
      })
    );
  }

  shortInputDateString(date: Date | string | null | undefined): string {
    if (!date) return '';
    const dateF = new Date(date);
    const year = dateF.getFullYear();
    const month = String(dateF.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = String(dateF.getDate()).padStart(2, '0'); // Use getDate() instead of getDay()
    return `${year}-${month}-${day}`;
  }

  /**
   * Parses a string into a number.
   * Returns `undefined` if the input is not a valid number.
   *
   * @param value The string to parse.
   * @returns The parsed number, or `undefined` if invalid.
   */
  private parseNumberOrUndefined(value: string | null): number | undefined {
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  intOrNull(value: string | null | number | undefined) {
    if (typeof value == 'number') return value
    if (value == null || value == undefined) return null
    const parsed = parseInt(value)
    if (!isNaN(parsed)) {
      return parsed
    }
    return null
  }

  fechaFormateada(date: string | Date | undefined | null, anioDosNumeros = false): string | undefined {
    if (!date) return;

    if (typeof date === 'string') {
      date = date.substring(0, 10) + 'T12:00:00Z'
    }

    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return ''; // Retorna cadena vacía si la fecha es inválida
    }

    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth() + 1;
    const year = anioDosNumeros ? dateObj.getFullYear().toString().substring(2, 4) : dateObj.getFullYear();


    return `${day.toString().padStart(2, '0')}/${monthIndex.toString().padStart(2, '0')}/${year}`;
  }

  sanitazeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  isISODateString(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Expresión regular para validar el formato ISO 8601
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

    const shortDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    const dateTimeRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;


    if (!isoDateRegex.test(value) && !shortDateRegex.test(value) && !dateTimeRegex.test(value)) {
      return false;
    }

    // Validar si se puede convertir a un objeto Date válido
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  /**
   * Convierte un Date o string a formato datetime de MySQL (YYYY-MM-DD HH:MM:SS)
   * @param date - Fecha a convertir (Date object o string válido)
   * @returns String en formato datetime de MySQL o null si la fecha no es válida
   */
  public toMySQLDateTime(date: Date | string): string | null {
    try {
      // Convertir a Date object si es string
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      // Validar que la fecha sea válida
      if (isNaN(dateObj.getTime())) {
        return null;
      }

      // Obtener componentes de la fecha
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');

      // Formatear en estilo MySQL datetime
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error converting date to MySQL format:', error);
      return null;
    }
  }


  keysOf(data: object) {
    return Object.keys(data)
  }

  fileFromInputEvent(event: Event): null | File {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return null;
    }

    return input.files[0];
  }

  cleanString(input: string): string {
    // Normalizar la cadena para eliminar acentos y tildes
    const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Eliminar caracteres no alfanuméricos excepto espacios
    const cleaned = normalized.replace(/[^a-zA-Z0-9 _-]/g, '');
    // Aplicar trim para eliminar espacios extra al inicio y al final
    return cleaned.trim();
  }


  anioFromFecha(fecha: string | Date | undefined | null) {
    if (!fecha) return
    return new Date(fecha).getFullYear()
  }

  primerTelefonoFromTelefonos(telefonos: ({ numero: string }[]) | undefined | null) {
    if (!telefonos?.length) return
    return telefonos[0].numero
  }


  localDelete(list: (unknown[]) | (undefined), row: unknown) {
    if (!list) return;
    list.splice(list.indexOf(row), 1)
  }

  uniqueKeys(data: [], key: string): unknown[] {
    return Array.from(new Set(data.map((row) => row[key])))
  }

  /**
   * Calcula la distancia de Levenshtein entre dos cadenas.
   * La distancia de Levenshtein es el número mínimo de operaciones (inserción, eliminación o sustitución)
   * necesarias para transformar una cadena en otra.
   *
   * @param {string} source - Cadena de origen.
   * @param {string} target - Cadena de destino.
   * @returns {number} - La distancia de Levenshtein entre las dos cadenas.
   */
  public levenshteinDistance(source: string, target: string): number {
    // Inicializa la matriz de distancias con dimensiones (target.length + 1) x (source.length + 1)
    const distanceMatrix = this.initializeDistanceMatrix(source.length, target.length);

    // Llena la primera fila y la primera columna de la matriz con valores iniciales
    this.fillInitialDistances(distanceMatrix, source.length, target.length);

    // Calcula las distancias para el resto de la matriz
    this.calculateDistances(distanceMatrix, source, target);

    // La distancia final se encuentra en la última celda de la matriz
    return distanceMatrix[target.length][source.length];
  }

  /**
   * Calcula la puntuación de similitud entre dos nombres utilizando una combinación de
   * coincidencia exacta, coincidencia parcial y la distancia de Levenshtein.
   *
   * @param {string} nombreBusqueda - El nombre que se está buscando.
   * @param {string} nombre - El nombre con el que se compara.
   * @returns {number} - Puntuación de similitud entre 0 y 100.
   */
  calcularPuntuacionSimilitud(nombreBusqueda: string, nombre: string): number {
    const nombreBusquedaUpper = this.normalizarNombre(nombreBusqueda);
    const nombreUpper = this.normalizarNombre(nombre);

    if (this.esCoincidenciaExacta(nombreUpper, nombreBusquedaUpper)) {
      return 100; // Coincidencia exacta
    }

    if (this.esCoincidenciaParcial(nombreUpper, nombreBusquedaUpper)) {
      return 80; // Coincidencia parcial
    }

    return this.calcularSimilitudLevenshtein(nombreUpper, nombreBusquedaUpper);
  }

  /**
   * Normaliza un nombre convirtiéndolo a mayúsculas.
   *
   * @param {string} nombre - El nombre a normalizar.
   * @returns {string} - El nombre en mayúsculas.
   */
  private normalizarNombre(nombre: string): string {
    return nombre.toUpperCase();
  }

  /**
   * Verifica si dos nombres son una coincidencia exacta.
   *
   * @param {string} nombre1 - Primer nombre a comparar.
   * @param {string} nombre2 - Segundo nombre a comparar.
   * @returns {boolean} - `true` si los nombres son iguales, `false` en caso contrario.
   */
  private esCoincidenciaExacta(nombre1: string, nombre2: string): boolean {
    return nombre1 === nombre2;
  }

  /**
   * Verifica si dos nombres tienen una coincidencia parcial (uno contiene al otro).
   *
   * @param {string} nombre1 - Primer nombre a comparar.
   * @param {string} nombre2 - Segundo nombre a comparar.
   * @returns {boolean} - `true` si hay una coincidencia parcial, `false` en caso contrario.
   */
  private esCoincidenciaParcial(nombre1: string, nombre2: string): boolean {
    return nombre1.includes(nombre2) || nombre2.includes(nombre1);
  }

  /**
   * Calcula la similitud entre dos nombres utilizando la distancia de Levenshtein.
   *
   * @param {string} nombre1 - Primer nombre a comparar.
   * @param {string} nombre2 - Segundo nombre a comparar.
   * @returns {number} - Puntuación de similitud basada en la distancia de Levenshtein.
   */
  private calcularSimilitudLevenshtein(nombre1: string, nombre2: string): number {
    const distancia = this.levenshteinDistance(nombre1, nombre2);
    const maxLength = Math.max(nombre1.length, nombre2.length);

    if (maxLength === 0) {
      return 100; // Si ambos nombres están vacíos, se considera una coincidencia perfecta
    }

    return ((maxLength - distancia) / maxLength) * 100;
  }

  /**
   * Inicializa una matriz de distancias con dimensiones (targetLength + 1) x (sourceLength + 1).
   * Todas las celdas se inicializan como `null`.
   *
   * @param {number} sourceLength - Longitud de la cadena de origen.
   * @param {number} targetLength - Longitud de la cadena de destino.
   * @returns {number[][]} - Matriz de distancias inicializada.
   */
  private initializeDistanceMatrix(sourceLength: number, targetLength: number): number[][] {
    return Array(targetLength + 1)
      .fill(null)
      .map(() => Array(sourceLength + 1).fill(null));
  }

  /**
   * Llena la primera fila y la primera columna de la matriz de distancias con valores iniciales.
   * La primera fila representa la distancia de la cadena vacía a la cadena de origen.
   * La primera columna representa la distancia de la cadena vacía a la cadena de destino.
   *
   * @param {number[][]} matrix - Matriz de distancias.
   * @param {number} sourceLength - Longitud de la cadena de origen.
   * @param {number} targetLength - Longitud de la cadena de destino.
   */
  private fillInitialDistances(matrix: number[][], sourceLength: number, targetLength: number): void {
    // Llena la primera fila con valores de 0 a sourceLength
    for (let i = 0; i <= sourceLength; i++) {
      matrix[0][i] = i;
    }

    // Llena la primera columna con valores de 0 a targetLength
    for (let j = 0; j <= targetLength; j++) {
      matrix[j][0] = j;
    }
  }

  /**
   * Calcula las distancias para el resto de la matriz utilizando el algoritmo de Levenshtein.
   * Para cada celda, se calcula el costo mínimo entre inserción, eliminación y sustitución.
   *
   * @param {number[][]} matrix - Matriz de distancias.
   * @param {string} source - Cadena de origen.
   * @param {string} target - Cadena de destino.
   */
  private calculateDistances(matrix: number[][], source: string, target: string): void {
    for (let j = 1; j <= target.length; j++) {
      for (let i = 1; i <= source.length; i++) {
        // Si los caracteres son iguales, no hay costo adicional
        if (target[j - 1] === source[i - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          // Calcula el costo mínimo entre inserción, eliminación y sustitución
          matrix[j][i] = Math.min(
            matrix[j - 1][i] + 1,    // Inserción
            matrix[j][i - 1] + 1,    // Eliminación
            matrix[j - 1][i - 1] + 1  // Sustitución
          );
        }
      }
    }
  }

  /**
 * Calcula el hash SHA-256 de un archivo proporcionado.
 *
 * @param file - El archivo del cual se calculará el hash.
 * @returns Una promesa que resuelve al hash del archivo en formato hexadecimal (string).
 */
  public async calculateFileHash(file: File): Promise<string> {
    // 1. Leer el archivo como ArrayBuffer
    const buffer = await file.arrayBuffer();

    // 2. Calcular el hash usando Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // 3. Convertir el hash a string hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  /**
   * Genera una URL para mostrar un archivo en línea (inline)
   * @param url - URL del archivo
   * @returns URL completa para visualización
   */
  fileUrlInLine(url: string): string {
    if (!url) return '';
    // Asumir que las URLs relativas necesitan la base URL del API
    if (url.startsWith('/')) {
      return url; // Ya es una URL completa
    }
    return url;
  }

  /**
   * Genera una URL segura para mostrar un archivo en línea
   * @param url - URL del archivo
   * @returns URL segura para iframe/embed
   */
  fileUrlInLineSanatized(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrlInLine(url));
  }
}
