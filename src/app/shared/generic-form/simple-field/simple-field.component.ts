
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject, OnChanges, AfterViewInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Validator } from '../generic-form.component';
import { InputStyle } from '../form-field/form-field.component';

@Component({
    selector: 'app-simple-field',
    imports: [
    FormsModule
],
    templateUrl: './simple-field.component.html',
    styleUrl: './simple-field.component.css'
})
export class SimpleFieldComponent implements OnChanges, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() label: string | undefined
  @Input() placeholder: string | undefined
  @Input() type = ''

  @Input() value?: string|number
  @Output() valueChange = new EventEmitter<string|number>()

  @Input() defaultValue?:string|number

  @Input() sm = false
  @Input() validator: Validator | undefined = {}

  @Input() style:InputStyle|undefined={
    input:'form-control'
  }

  @Input() inputGroup? =false

  errorFeedback= ''
  @Input() valid:boolean|undefined=false
  @Output() validChange= new EventEmitter<boolean>()


  @ViewChild('inputModel') inputModel!: NgModel;

  @Output() invalidChange = new EventEmitter<boolean>()

  @Output() unknownChange= new EventEmitter<void>()

  ngOnChanges(changes:SimpleChanges){
    if(changes['value']){
      this.setErrorMessage()
      this.validateDate()
      this.valueChange.emit(this.value)
      this.unknownChange.emit()
      //console.log(this.label,': value: ',this.value, ', valid: ', this.valid)
    }
  }

  ngAfterViewInit(){
    this.setDefault()
    this.setErrorMessage()
  }

  private validateDate(){
    if(this.type==='date' && this.value && typeof this.value =='string' && this.value.length>10){
      this.value= this.value.substring(0,10)
    }
  }

  setDefault(){
    if(this.defaultValue!==undefined && this.value==undefined){
      this.value=this.defaultValue
    }
  }

  /**
   * Returns true if errorCode exists in input ngModel errors
   * @param {string} errorCode
   * @returns {boolean}
   */
  hasError(errorCode: string): boolean {
    if(!this.inputModel) return false
    return !!this.inputModel?.errors?.[errorCode];
  }

  setErrorMessage(){
    this.errorFeedback= this.getErrorMessage()
    this.valid=!this.errorFeedback
    this.validChange.emit((!this.errorFeedback))
    this.unknownChange.emit()
  }

  getErrorMessage(): string {
    if (this.hasError('required') && (this.value===undefined || this.value==='')) {
      return 'El campo '+ (this.label??'').toLowerCase() +' es obligatorio.';
    }
    if (this.hasError('email')) {
      return 'Debe ingresar un correo electrónico válido.';
    }
    if (this.hasError('pattern')) {
      return 'El formato no es válido.';
    }
    if(this.type==='number'){
      return this.isValidNumber()
    }
    if(this.type=='text' && this.validator?.regex){
      return this.isValidRegex()
    }
    return '';
  }

  isValidRegex():string{
    if(typeof this.value==='string' && this.validator?.regex && typeof this.validator.regex ==='string'){
      const regex= new RegExp(this.validator.regex)
      if(!regex.test(this.value.toLowerCase()) && !regex.test(this.value.toUpperCase())) return 'El formato no es válido.'
    }
    return ''
  }

  isValidNumber():string{
    if(this.validator && this.value!==undefined && this.value!== null){
      if(!this.isNumber(this.value)){
        return 'Ingrese un número válido.'
      }
      if(this.validator.min!==undefined && this.value < this.validator.min){
        return `El número debe ser mas grande que ${this.validator.min}.`;
      }
      if(this.validator.max!==undefined && this.value > this.validator.max){
        return `El número debe ser menor que ${this.validator.max}.`;
      }
    }
    return ''
  }

  isNumber(value:number|string|undefined):value is number{
    if(this.value==undefined || this.value===''){
      return false
    }
    return !isNaN(parseInt(value?.toString()??''))
  }
}
