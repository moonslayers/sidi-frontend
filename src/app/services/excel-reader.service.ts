import { Injectable, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {
  private utils = inject(UtilsService);


  /**
 * Lee un archivo Excel y devuelve los datos en bruto como un arreglo de arreglos.
 * 
 * @param file - El archivo Excel que se desea procesar.
 * @param sheetName - Nombre de la hoja a leer. Si no se especifica, se usará la primera hoja.
 * @returns Una promesa que resuelve con los datos de la hoja en formato de matriz bidimensional.
 * 
 * ### Notas:
 * - Los datos de cada celda se mantienen sin procesar.
 * - Si no se especifica el nombre de la hoja, se selecciona automáticamente la primera.
 * - Utiliza la biblioteca `XLSX` para la lectura del archivo.
 * 
 * ### Ejemplo de uso:
 * ```typescript
 * const file = input.files[0];
 * const rawData = await readExcelAsRawData(file, 'Hoja1');
 * console.log(rawData);
 * ```
 */
  public readExcelAsRawData(file: File, sheetName: string | undefined = undefined): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Evento para manejar la carga exitosa del archivo
      reader.onload = (event) => {
        try {
          // Convierte el resultado del archivo a un Uint8Array
          const data = new Uint8Array(event.target?.result as ArrayBuffer);

          // Lee el libro de Excel usando XLSX
          const workbook = XLSX.read(data, { type: 'array', });

          // Selecciona el nombre de la hoja si no se especificó
          if (!sheetName) {
            sheetName = workbook.SheetNames[0];
          }

          // Obtiene la hoja correspondiente
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) {
            throw new Error(`La hoja "${sheetName}" no existe en el archivo.`);
          }

          // Convierte la hoja a un arreglo de arreglos
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });

          // Filtrar filas vacías o con datos nulos
          const filteredData = json.filter(row => {
            // Verificar si la fila es un array y si tiene al menos un valor no vacío
            return Array.isArray(row) && row.length>0;
          });
          resolve(filteredData);
        } catch (error) {
          reject(error); // Maneja errores en la lectura o conversión del archivo
        }
      };

      // Evento para manejar errores en la lectura del archivo
      reader.onerror = (error) => reject(error);

      // Lee el archivo como un ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }

  public async sheetNames(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          resolve(workbook.SheetNames)
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  }

  /**
 * Transforma un archivo Excel en una lista de objetos JSON.
 * 
 * @param file - El archivo Excel que se desea procesar.
 * @returns Una promesa que resuelve con una lista de objetos JSON,
 * donde cada fila es un objeto basado en el encabezado del archivo.
 * 
 * ### Notas:
 * - El encabezado de la primera fila se utiliza como claves del objeto.
 * - Las claves se limpian y convierten a minúsculas, reemplazando espacios con guiones bajos (`_`).
 * - Las filas vacías o celdas faltantes se representan con `null`.
 * 
 * ### Ejemplo de uso:
 * ```typescript
 * const file = input.files[0];
 * const jsonList = await readExcelAsJsonList(file);
 * console.log(jsonList);
 * ```
 */
  async readExcelAsJsonList(file: File, sheetName: string | undefined = undefined, chunkSize = 0): Promise<Record<string, unknown>[]> {
    // Lee los datos del archivo Excel en formato bruto
    const data = await this.readExcelAsRawData(file, sheetName);
    console.log(data)

    // Calcula el tamaño máximo a leer dependiendo de chunkSize
    const size = chunkSize > 0 ? (chunkSize + 1) : (data.length - 1);
    // Si no hay datos o solo contiene el encabezado, retorna un array vacío
    if (!data || data.length < 2) {
      return [];
    }

    /**
     * Procesa la primera fila como encabezado.
     * Limpia los valores, reemplaza espacios con guiones bajos y los convierte a minúsculas.
     */
    const header = (data[0] as string[]).map((item) =>
      this.utils.cleanString(item).replace(/ /g, '_').toLowerCase()
    );

    /**
     * Procesa las filas restantes, asignando valores basados en el encabezado.
     * Cada fila se convierte en un objeto JSON con claves provenientes del encabezado.
     */
    return data.slice(1, size + 1).map((row) => {
      const record: Record<string, unknown> = {};

      // Asocia cada columna con su respectiva clave del encabezado
      if (Array.isArray(row)) {
        header.forEach((key, index) => {
          record[key] = row[index] || null; // Usa `null` si no hay un valor
        });
      }

      return record; // Devuelve el objeto construido
    });
  }
}
