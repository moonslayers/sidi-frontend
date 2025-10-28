import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecase',
  standalone: true
})
export class TitlecasePipe implements PipeTransform {

  transform(value: string|number|undefined): unknown {
    if(!value) return 'N/A'
    if(value=='id') return 'Folio'
    if(value=='created_at') return 'Creado En'
    if(value=='updated_at') return 'Actualizado En'
    if(value=='deleted_at') return 'Eliminado En'
    if(value=='usuarios') return 'Creado Por'
    
    if(typeof value =='number') value= value.toString()
    if(value.includes('.') ){
      const keys = value.split('.')
      if(keys.length>1){
        const word = keys[keys.length-2]
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
    }

    return value
      .toLowerCase()
      .replaceAll('_',' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
