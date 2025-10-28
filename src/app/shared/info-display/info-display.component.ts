import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-display-info',
    imports: [
    TitlecasePipe,
    DatePipe
],
    templateUrl: './info-display.component.html',
    styleUrl: './info-display.component.css'
})
export class InfoDisplayComponent implements OnChanges {
  utils = inject(UtilsService);

  @Input() title= ''
  @Input() data?:unknown={}
  keys:string[]=[]
  @Input() dateFormat='dd/MM/yyyy'
  @Input() sm? =false

  ngOnChanges( changes:SimpleChanges){
    if(changes['data'] && this.keys.length===0 && this.data){
      this.keys=this.utils.keysOf(this.data)
    }
  }

  dataType(value:unknown):'date'|'number'|'default'|'empty'|'object'{
    if(this.utils.isISODateString(value as string)){
      return 'date'
    }
    if(typeof value==='number'){
      return 'number'
    }
    if(value===undefined|| value===null || value===''){
      return 'empty'
    }
    if(typeof value==='object'){
      return 'object'
    }
    return 'default'
  }

  // Método auxiliar para obtener valores de forma segura
  getValue(data: unknown, key: string): unknown {
    if (data === null || data === undefined) return undefined;
    const dataRecord = data as Record<string, unknown>;
    return dataRecord[key];
  }

  // Método auxiliar para obtener valores de fecha de forma segura
  getValueAsDate(data: unknown, key: string): string | number | Date | null | undefined {
    const value = this.getValue(data, key);
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      return value;
    }
    return null;
  }
}
