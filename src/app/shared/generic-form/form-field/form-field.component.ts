import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Validator } from '../generic-form.component';

import { SimpleFieldComponent } from '../simple-field/simple-field.component';
import { SelectFieldComponent } from '../select-field/select-field.component';
import { CheckboxFieldComponent } from '../checkbox-field/checkbox-field.component';
import { FieldTypesService } from './field-types.service';
import { AutoCompleteField, AutocompleteFieldComponent } from '../autocomplete-field/autocomplete-field.component';
import { FileInput, } from "../../file-input/file-input.component";

export type FormField = (SimpleField|AutoCompleteField|SelectField|CheckBoxField|FileInput)&{hidden?:boolean; validator?:{disabled?:boolean}};

export interface SimpleField extends BasicInput{
  label?:string;
  type:FieldType;
  placeholder?:string;
  validator?:Validator;
  defaultValue?:string|number;
}

export type FieldType= 'text'|'number'|'email'|'date'|'boolean'|'time'

export interface SelectField extends BasicInput{
  label?:string;
  options:Option[];
  valid?:boolean;
  defaultOption?:string|number;
  validator?:Validator;
  useAutoComplete?:boolean;
}

export type Option= string|number|SelectItem;

export interface SelectItem{
  value:string|number;
  label:string;
}

export interface BasicInput{
  key:string;
  value?:string;
  style?:InputStyle;
  valid?:boolean;
  inputGroup?:boolean;
}

export interface CheckBoxField{
  key:string;
  label?:string;
  value?:boolean|string;
  defaultValue?:unknown;
  type:FieldType;
  checkBoxType:CheckBoxType;
  style?:CheckboxStyle;
  valid?:boolean;
  validator?:Validator;
  asYesOrNo?:boolean;
}

export type CheckBoxType='checkbox'|'radio'|'switch'

export interface CheckboxStyle{
  div?:string;
  label?:string;
  input?:string;
  checkboxDiv?:string;
}

export interface InputStyle{
  div?:string;
  label?:string;
  input?:string;
}


@Component({
    selector: 'app-form-field',
    imports: [
    SimpleFieldComponent,
    SelectFieldComponent,
    CheckboxFieldComponent,
    AutocompleteFieldComponent
],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  fieldTypes = inject(FieldTypesService);
  cdr = inject(ChangeDetectorRef);

  @Input() field!: FormField
  @Output() fieldChange = new EventEmitter<FormField>()
  @Output() valueChange= new EventEmitter<unknown>()

  @Input() sm =false
  @Input() defaultInputDivClass='col-12 col-sm-6 col-md-4 p-3'
  @Input() defaultCheckBoxDivClass='col-12 col-sm-6 col-md-4 px-4'

  // Helper method to ensure extraData is always Record<string, unknown>
  getExtraData(): Record<string, unknown> {
    if (this.fieldTypes.isAutoCompleteField(this.field)) {
      if (this.field.extraData && typeof this.field.extraData === 'object' && !Array.isArray(this.field.extraData)) {
        return this.field.extraData as Record<string, unknown>;
      }
    }
    return {};
  }


}
