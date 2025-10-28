import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';

interface TablaLocalRow {
  hidden?: boolean;
  [key: string]: unknown;
}
import { UtilsService } from '../../services/utils.service';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tabla-local',
    imports: [
    TitlecasePipe,
    RouterLink,
    FormsModule
],
    templateUrl: './tabla-local.component.html',
    providers: [DatePipe],
    styleUrl: './tabla-local.component.css'
})
export class TablaLocalComponent implements OnChanges {
  private utils = inject(UtilsService);
  private datePipe = inject(DatePipe);

  @Input() title?:string
  @Input() caption?:string
  @Input() dataSource:TablaLocalRow[]=[]
  @Input() keys:string[]=[]
  @Input() ignore:string[]=[]
  @Input() sm? =false
  @Input() tableClass='table'
  @Input() viewRoute?:string
  @Input() ignoreNumber? =true
  @Input() urlRoute?:string
  @Input() id= 'id'

  @Input() expand =false

  filtros:Record<string, string>={}
  lastSort= ''
  showSearch =false

  ngOnChanges(changes:SimpleChanges){
    if(changes['dataSource'] && this.dataSource.length>0){
      const firstRow = this.dataSource[0] as Record<string, unknown>;
      this.keys = this.utils.keysOf(firstRow)
      if(this.ignore.length>0){
        this.keys= this.keys.filter(key => !this.ignore.includes(key))
      }
      this.keys=this.keys.filter( key => typeof firstRow[key] !=='object')
      if(this.ignoreNumber){
        this.keys= this.keys
        .filter((key)=>
          !this.dataSource.some(row => {
            const rowRecord = row as Record<string, unknown>;
            return (typeof rowRecord[key]==='number' && key!=='id')
          })
        )
      }
    }
  }

  filtrar() {
    if (!this.dataSource || this.dataSource.length === 0) return;

    const keys = Object.keys(this.filtros).filter((key) => this.filtros[key]); // Filtra claves con valores en los filtros.

    if (keys.length === 0) {
      this.dataSource.forEach((row) => {
        const rowRecord = row as Record<string, unknown>;
        rowRecord['hidden'] = false;
      }); // Si no hay filtros, muestra todos los elementos.
      return;
    }

    this.dataSource.forEach((row) => {
      const rowRecord = row as Record<string, unknown>;
      rowRecord['hidden'] = !keys.every((key) => {
        const rowValue = rowRecord[key]?.toString().toLowerCase() || '';
        const filterValue = this.filtros[key]?.toString().toLowerCase() || '';
        return rowValue.includes(filterValue);
      });
    });
  }

  sortByKey(key: string): void {
    const ascending= key===this.lastSort
    this.dataSource.sort((a, b) => {
        const aRecord = a as Record<string, unknown>;
        const bRecord = b as Record<string, unknown>;
        const valueA = aRecord[key];
        const valueB = bRecord[key];

        // Convertir a string para comparación segura
        const strA = valueA !== null && valueA !== undefined ? String(valueA) : '';
        const strB = valueB !== null && valueB !== undefined ? String(valueB) : '';

        // Compara como cadenas
        if (strA < strB) {
            return ascending ? -1 : 1;
        }
        if (strA > strB) {
            return ascending ? 1 : -1;
        }
        return 0; // Si son iguales
    });

    this.lastSort=key
}

  valueClean(value:unknown):string{
    if(value===null || value===undefined || value===''){
      return 'N/A'
    }
    if(this.utils.isISODateString(value as string)){
      return this.datePipe.transform(value as string)??'N/A'
    }
    if(typeof value =='string'){
      return value.toUpperCase()
    }
    return String(value)
  }
}
