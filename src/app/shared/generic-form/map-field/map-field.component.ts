import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { GroupStyle, FormGroupComponent } from "../form-group/form-group.component";

export interface MapField{
  title:string;
  key?:string;
  latitud:{
    key:string;
    value?:number;
  },
  longitud:{
    key:string;
    value?:number;
  }
  style?: GroupStyle;
  valid?:boolean;
}

@Component({
    selector: 'app-map-field',
    imports: [
        FormGroupComponent
    ],
    templateUrl: './map-field.component.html',
    styleUrl: './map-field.component.css'
})
export class MapFieldComponent implements OnInit {
  @Input() title!:string
  @Input() style?: GroupStyle;
  @Input() latitud?:number
  @Output() latitudChange= new EventEmitter<number>()
  @Input() longitud?:number
  @Output() longitudChange = new EventEmitter<number>()
  @Input() valid?:boolean
  @Output() validChange = new EventEmitter<boolean>()

  ngOnInit(){
    this.valid=true
    this.validChange.emit(true)
  }
}
