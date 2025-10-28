import { Injectable } from '@angular/core';
import { BasicInput, CheckBoxField, FormField, SelectField, SimpleField } from './form-field.component';
import { DinamicGroupField } from '../dinamic-group-field/dinamic-group-field.component';
import { FormGroup } from '../form-group/form-group.component';
import { OrderableList } from '../orderable-list/orderable-list.component';
import { AutoCompleteField } from '../autocomplete-field/autocomplete-field.component';
import { MapField } from '../map-field/map-field.component';
import { Form } from '../generic-form.component';
import { FileInput } from '../../file-input/file-input.component';

@Injectable({
  providedIn: 'root'
})
export class FieldTypesService {
  isSimpleField(field: unknown): field is SimpleField {
    const tryField= (field as SimpleField)
    return tryField.type !== undefined &&  tryField.type!=='boolean'
  }

  isAutoCompleteField(field: unknown): field is AutoCompleteField {
    return (field as AutoCompleteField).apiUrl !== undefined && (field as AutoCompleteField).keyList!==undefined
  }

  isSelectField(field: unknown): field is SelectField {
    return (field as SelectField).options !== undefined
  }
  
  isBasicInput(field: unknown): field is BasicInput {
    return (field as BasicInput).key !== undefined
  }

  isCheckboxField(field:unknown):field is CheckBoxField{
    return (field as CheckBoxField).type === 'boolean'
  }

  isFormField(field:unknown):field is FormField{
    return (field as FormField).key!== undefined
  }

  isFormGroup(field: unknown): field is FormGroup {
    return (field as FormGroup).fields !== undefined
  }

  isDinamicGroupField(field:unknown):field is DinamicGroupField{
    return (field as DinamicGroupField).baseFields!== undefined
  }

  isOrderableList(field:unknown):field is OrderableList{
    return (field as OrderableList).orderableList!== undefined
  }

  isMapField(field:unknown):field is MapField{
    return (field as MapField).latitud !==undefined
  }

  isFileInput(field:unknown):field is FileInput{
    return (field as FileInput).apiUrl!==undefined && (field as FileInput).accept!==undefined
  }

  getFormFieldByKey(form:Form, key:string):FormField|null{
    for(const field of form){
      if(this.isFormField(field) && field.key===key){
        return field
      }
      if(this.isFormGroup(field)){
        for(const innerField of field.fields){
          if(innerField.key===key){
            return innerField
          }
        }
      }
    }
    return null
  }
}