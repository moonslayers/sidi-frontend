import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Validator } from '../generic-form.component';
import { FormsModule } from '@angular/forms';
import { CheckBoxType, CheckboxStyle } from '../form-field/form-field.component';

@Component({
    selector: 'app-checkbox-field',
    imports: [
        FormsModule
    ],
    templateUrl: './checkbox-field.component.html',
    styleUrl: './checkbox-field.component.css'
})
export class CheckboxFieldComponent implements OnInit {
  @Input() style:CheckboxStyle|undefined
  @Input() validator?: Validator
  @Input() type?: CheckBoxType='checkbox'
  @Input() key!:string
  @Input() label?:string
  @Input() value?: boolean|string
  @Input() defaultValue?:unknown
  @Output() valueChange = new EventEmitter<boolean|string>()
  @Output() unknownChange= new EventEmitter<void>()
  @Input() valid? =true
  @Output() validChange = new EventEmitter<boolean>()
  @Input() asYesOrNo? =false

  defaultClass= 'col-auto px-3 pt-3'

  ngOnInit(){
    if(this.type===undefined){
      this.type='checkbox'
    }
    this.setDefault()
    this.setIsValid()
  }

  onInputChange(event: Event){
    const target = event.target as HTMLInputElement;
    const value= target.checked
    this.setValue(value)
    this.valueChange.emit(this.value)
    this.unknownChange.emit()
  }

  setValue(value:boolean){
    if(this.asYesOrNo==true){
      this.value=value?"SI":"NO"
      return
    }
    this.value= value
  }

  setDefault(){
    if(this.defaultValue!==undefined && this.value===undefined){
      this.setValue(true)
    }
    if(this.value===undefined){
      this.setValue(false)
    }
    this.valueChange.emit(this.value)
    this.unknownChange.emit()
  }

  asBoolean(){
    return this.value=='SI'?true:false
  }

  setIsValid(){
    this.valid=true
    this.validChange.emit(true)
    this.unknownChange.emit()
  }
}
