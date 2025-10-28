import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '../form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { Validator } from '../generic-form.component';

export interface FormGroup{
  title:string;
  style?:GroupStyle;
  fields:FormField[];
  key?:string;
  valid?:boolean;
  validator?:Validator;
}

export interface GroupStyle{
  div?:string;
  title?:string;
  border?:string;
}

@Component({
    selector: 'app-form-group',
    imports: [
        CommonModule
    ],
    templateUrl: './form-group.component.html',
    styleUrl: './form-group.component.css'
})
export class FormGroupComponent {
  @Input() title:string|undefined
  @Input() style:GroupStyle|undefined

  @Input() showAddButton =false
  @Input() addButtonText= ''
  @Input() addButtonDiv= 'col-auto px-1'
  @Input() addButtonIcon= 'bi bi-plus-circle-fill'
  @Input() addButtonStyle= 'btn btn-success'
  @Input() addButtonDisabled?:boolean
  @Output() buttonEvent= new EventEmitter<void>()

  @Input() defaultTitleClass= 'h5 fw-bold'
  @Input() defaultBorderClass= 'm-0 my-2 border border-primary'
}
