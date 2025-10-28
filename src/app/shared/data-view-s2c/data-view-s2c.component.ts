import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { CollapsableComponent } from '../collapsable/collapsable.component';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-data-view-s2c',
    imports: [
    CollapsableComponent,
    TitlecasePipe
],
    templateUrl: './data-view-s2c.component.html',
    styleUrl: './data-view-s2c.component.css',
    providers: [
        DatePipe,
    ]
})
export class DataViewS2cComponent implements OnChanges {
  utils = inject(UtilsService);
  private datePipe = inject(DatePipe);

  @Input() title= ''
  @Input() data:(unknown)|(unknown[])
  @Input() ignoreNumbers=false
  @Input() ignoreKeys:string[]=[]
  @Input() emptyMsj= 'No hay datos registrados.'
  @Input() nullString='N/A'
  keys:string[]=[]

  ngOnChanges(changes:SimpleChanges){
    if(changes['data'] && this.data){
      this.setKeys()
    }
  }

  setKeys() {
    if (!this.data) return;
  
    if (Array.isArray(this.data) && this.data.length > 0) {
      this.keys = Object.keys(this.data[0]).filter(key => !this.ignoreKeys.includes(key));
      return;
    }
  
    this.keys = Object.keys(this.data).filter(key => !this.ignoreKeys.includes(key) && !this.isIgnored(key) );
  }

  isIgnored(key:string){
    if(this.isArray(this.data)){
      return this.isIgnoredInArray(key)
    }
    return this.isIgnoredValue(key,this.data)
  }

  isIgnoredInArray(key:string):boolean{
    if(!this.isArray(this.data)) return false
    return this.data.some((row)=> this.isIgnoredValue(key,row))
  }

  isIgnoredValue(key:string,data:unknown):boolean{
    if(data===null || data===undefined) return false

    // Convertir a Record para acceso seguro a propiedades
    const dataRecord = data as Record<string, unknown>;

    if(this.ignoreNumbers && this.utils.isNumber(dataRecord[key]) && key!=='id') return true
    const value = dataRecord[key];
    const type= typeof value;

    if(Array.isArray(data)) return true
    if(type=='object' && value && typeof value === 'object' && 'nombre' in value && (value as Record<string, unknown>)['nombre']) return false
    if(type=='object') return true
    if(type =='function') return true
    return false
  }

  valueOf(value:unknown){
    if(value===null|| value==undefined|| value=='') return this.nullString

    // Convertir a Record para acceso seguro a propiedades
    const valueRecord = value as Record<string, unknown>;

    if('nombre' in valueRecord && valueRecord['nombre']){
      return String(valueRecord['nombre'])
    }
    if(this.utils.isISODateString(value as string)){
      return this.datePipe.transform(value as string)
    }
    return String(value)
  }

  getValue(data: unknown, key: string): unknown {
    if (data === null || data === undefined) return undefined;
    const dataRecord = data as Record<string, unknown>;
    return dataRecord[key];
  }

  isArray(data:unknown):data is unknown[]{
    if(!data)return false
    return (data as unknown[]).length!==undefined
  }
}
