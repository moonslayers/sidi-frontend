import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  // Método que recibe el evento del input y devuelve una promesa con los datos CSV procesados
  public arrayDataFromEvent<T>(event: unknown): Promise<T[]> {
    if (!event || typeof event !== 'object' || !('target' in event)) {
      return Promise.reject('Invalid event object');
    }
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      return Promise.reject('No file selected');
    }
    const file = target.files[0];
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: unknown) => {
          if (!e || typeof e !== 'object' || !('target' in e)) {
            reject('Invalid reader event');
            return;
          }
          const target = e.target as FileReader;
          if (typeof target.result !== 'string') {
            reject('Invalid file result');
            return;
          }
          const csv = target.result;
          const data = this.parseCsvData(csv) as T[];
          resolve(data);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      } else {
        reject('File null');
      }
    });
  }

  // Función para procesar los datos del CSV
  private parseCsvData(csv: string): unknown[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.replaceAll(/"/g, '').replaceAll(/'/g, '').trim()); // Quitar comillas dobles y espacios
    const csvData: Record<string, string>[] = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        if(header.trim()){
          obj[header.trim()] = cols[index]?.replaceAll(/"/g, '').trim() || ''; // Asegurarse de que el valor no sea undefined
        }
      });
      return obj;
    });
    return csvData.filter((row)=>{
      const values: string[]= Object.values(row)
      // Si alguno de los valores no es una cadena vacía, mantener el objeto
      return values.some((value) => !(value.trim()=== ''|| value===undefined || value===null));
    })
  }



  public downloadCsvTemplate(csvHeaders: string[] = []) {
    const csvRows = [csvHeaders]; // Aquí puedes agregar más filas si es necesario

    // Convertir el arreglo a formato CSV
    const csvContent = this.convertArrayToCsv(csvRows);

    // Crear un Blob con el contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'storage_structure.csv');
    link.click();
  }

  // Función para convertir un arreglo en formato CSV
  private convertArrayToCsv(data: string[][]): string {
    return data.map(row => row.join(',')).join('\n');
  }
}
