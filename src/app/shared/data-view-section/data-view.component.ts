import { DatePipe, NgClass } from '@angular/common';
import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { RouterLink } from '@angular/router';

export type BootstrapClass ='primary'|'secondary'|'success'|'warning'|'info'|'danger'|'dark'|'light'|'white'

@Component({
    selector: 'app-data-view-section',
    imports: [
    NgClass,
    TitlecasePipe,
    RouterLink
],
    templateUrl: './data-view.component.html',
    styleUrl: './data-view.component.css',
    providers: [
        DatePipe,
    ]
})
export class DataViewSectionComponent implements OnChanges {
  utils = inject(UtilsService);
  private datePipe = inject(DatePipe);

  @Input() data?:unknown|(unknown[])={}
  @Input() title?= ''
  @Input() ignoreNumbers =false
  @Input() keys:string[]=[]
  @Input() nullString='N/A'
  @Input() dateFormat= 'dd/MM/yyyyYY'
  @Input() zonaHoraria ="UTC"
  @Input() bootstrapClass:BootstrapClass='primary'
  @Input() expanded =true
  @Input() editarRoute?:string
  @Input() divClass= 'container-fluid p-3'
  @Input() sticky? =false
  @Input() ignoreKeys:string[]=[]
  @Input() emptyMsj= 'No hay datos registrados.'
  @Input() urlKey?:string
  @Input() disabled = false;

  ngOnChanges(changes:SimpleChanges){
    if(changes['data'] && this.keys.length==0){
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

  valueOf(value:unknown):string{
    if(value==='INNE') return 'INE'
    if(value===null|| value==undefined|| value=='') return this.nullString

    // Convertir a Record para acceso seguro a propiedades
    const valueRecord = value as Record<string, unknown>;

    if('nombre' in valueRecord && valueRecord['nombre']){
      return String(valueRecord['nombre'])
    }
    if(this.utils.isISODateString(value as string)){
      return this.utils.fechaFormateada(value as string, true) ??'N/A'
    }
    return String(value)
  }

  // Método auxiliar para obtener valores de forma segura desde el template
  getValue(data: unknown, key: string): unknown {
    if (data === null || data === undefined) return undefined;
    const dataRecord = data as Record<string, unknown>;
    return dataRecord[key];
  }

  // Método para abrir URL en nueva ventana
  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  // Método auxiliar para abrir URL desde datos unknown
  openUrlValue(row: unknown, urlKey: string): void {
    const url = this.getValue(row, urlKey);
    if (typeof url === 'string') {
      this.openUrl(url);
    }
  }

  valueBySubKeys(value: string) {
    const keys = value.split('.');
    if (Array.isArray(this.data)) return this.nullString;
    console.info(value)

    let currentValue = this.data as Record<string, unknown>;
    for (const key of keys) {
      if (currentValue === null || currentValue === undefined) {
        return this.nullString;
      }
      currentValue = currentValue[key] as Record<string, unknown>;
    }

    return this.valueOf(currentValue);
  }

  isArray(data:unknown):data is unknown[]{
    if(!data)return false
    return (data as unknown[]).length!==undefined
  }
}
