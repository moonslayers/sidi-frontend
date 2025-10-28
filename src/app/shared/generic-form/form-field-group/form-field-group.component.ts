import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { FieldTypesService } from '../form-field/field-types.service';

import { FormGroup, FormGroupComponent } from '../form-group/form-group.component';
import { FormField, FormFieldComponent } from '../form-field/form-field.component';

@Component({
    selector: 'app-form-field-group',
    imports: [
    FormFieldComponent,
    FormGroupComponent
],
    templateUrl: './form-field-group.component.html',
    styleUrl: './form-field-group.component.css'
})
export class FormFieldGroupComponent implements OnInit {
  fieldTypes = inject(FieldTypesService);

  @Input() formGroup!: FormGroup
  @Output() formGroupChange = new EventEmitter<FormGroup>()

  @Input() valid? =false
  @Output() validChange = new EventEmitter<boolean>()

  @Input() defaultInputDivClass='col-12 col-sm-6 col-md-4 p-3'
  @Input() defaultTitleClass= 'h5 fw-bold'
  @Input() defaultBorderClass= 'm-0 my-2 border border-primary'

  ngOnInit(){
    this.setIsValid()
  }

  onFieldChange(updatedField: FormField, field: FormField) {
    const fieldIndex = this.formGroup.fields.indexOf(field);
    if (fieldIndex > -1) {
      this.formGroup.fields[fieldIndex] = updatedField;
      this.formGroupChange.emit(this.formGroup)
      this.setIsValid()
    }
  }

  setIsValid(){
    this.valid= !this.formGroup.fields.some((field)=> !field.valid)
    this.validChange.emit(this.valid)
  }
}
