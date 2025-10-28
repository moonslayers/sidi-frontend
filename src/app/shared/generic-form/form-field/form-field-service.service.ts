import { Injectable } from '@angular/core';
import { FormField } from './form-field.component';

@Injectable({
  providedIn: 'root'
})
export class FormFieldService {
  resetValues(fields:FormField|(FormField[])){
    if(Array.isArray(fields)){
      fields.forEach((field)=>{
        field.value= undefined
      })
      return
    }
    fields.value= undefined
  }

  setValues(fields:FormField|(FormField[]),data:unknown){
    if(Array.isArray(fields)){
      fields.forEach((field)=>{
        const dataRecord = data as Record<string, unknown>;
        field.value= dataRecord[field.key] as string | number | boolean | undefined
      })
      return
    }
    const dataRecord = data as Record<string, unknown>;
    fields.value= dataRecord[fields.key] as string | number | boolean | undefined
  }

  setModelValues(fields:FormField|(FormField[]),data:unknown){
    if(!data) return
    const dataRecord = data as Record<string, unknown>;
    if(Array.isArray(fields)){
      fields.forEach((field)=>{
        if(dataRecord[field.key]!==undefined){
          dataRecord[field.key]= field.value
        }
      })
      return
    }
    dataRecord[fields.key]= fields.value
  }
}
