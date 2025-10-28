import { DatePipe, NgClass, NgFor, NgIf, } from '@angular/common';
import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';
import { FormularioFlotanteComponent } from "../formulario-flotante/formulario-flotante.component";
import { RouterLink } from '@angular/router';

export type BootstrapClass ='primary'|'secondary'|'success'|'warning'|'info'|'danger'|'dark'|'light'|'white'

@Component({
    selector: 'app-data-view',
    imports: [
        NgIf,
        NgFor,
        NgClass,
        TitlecasePipe,
        DatePipe,
        FormularioFlotanteComponent,
        RouterLink
    ],
    templateUrl: './data-view.component.html',
    styleUrl: './data-view.component.css'
})
export class DataViewComponent implements OnChanges {
  utils = inject(UtilsService);

  @Input() data: unknown|unknown[] = {}
  @Input() title?= ''
  @Input() ignoreNumbers =false
  @Input() keys:string[]=[]
  @Input() nullString='N/a'
  @Input() dateFormat= 'dd/MM/yyyyyy'
  @Input() bootstrapClass:BootstrapClass='primary'
  @Input() expanded =true
  @Input() useDialog =false
  showDialog =false
  @Input() editarRoute?:string
  @Input() divClass= 'container'
  @Input() clickExpand =false
  @Input() sticky? =false

  ngOnChanges(changes:SimpleChanges){
    if(changes['data']){
      this.setKeys()
    }
  }

  setKeys(){
    if(!this.data) return
    if(Array.isArray(this.data) && this.data.length>0){
      this.keys= Object.keys(this.data[0])
      return
    }
    this.keys= Object.keys(this.data)
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
    const dataRecord = data as Record<string, unknown>;
    if(this.ignoreNumbers && this.utils.isNumber(dataRecord[key]) && key!=='id') return true
    const value = dataRecord[key];
    const type= typeof value;
    if((type =='object' || type =='function' || type=='symbol')) return true
    return false
  }

  openDialog(){
    if(this.useDialog){
      this.showDialog=true
    }
  }

  isArray(data:unknown):data is unknown[]{
    if(!data)return false
    return Array.isArray(data)
  }

  // Método auxiliar para obtener valores de forma segura
  getValue(data: unknown, key: string): unknown {
    if (data === null || data === undefined) return undefined;
    const dataRecord = data as Record<string, unknown>;
    return dataRecord[key];
  }

  // Método auxiliar para obtener valor como string
  getValueAsString(data: unknown, key: string): string {
    const value = this.getValue(data, key);
    return value !== null && value !== undefined ? String(value) : '';
  }

  // Método auxiliar para obtener valor como Date para el pipe
  getValueAsDate(data: unknown, key: string): Date | string | null {
    const value = this.getValue(data, key);
    if (this.utils.isISODateString(value as string)) {
      return new Date(value as string);
    }
    return null;
  }

  // Getter para obtener datos como array
  get dataArray(): unknown[] {
    return Array.isArray(this.data) ? this.data : [];
  }
}
