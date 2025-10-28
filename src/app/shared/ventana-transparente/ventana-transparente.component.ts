import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
//EJEMPLO DE COMO USARLO
//<app-formulario-flotante [(show)]="show" (showChange)="actualizar_desde_hijo($event)">
//INGRESA AQUI TUS INPUTS Y BOTONES Y DEMAS COSAS PARA EL FORMULARIO
//<app-formulario-flotante>

//En el typscript donde lo uses debes tener definido al menos estas variables:
//  @Input()
//  show =false;
//  @Output() showChange = new EventEmitter<boolean>();
//
// y esta funcion.
//actualizar_desde_hijo($event:boolean){
//  this.showChange.emit($event)
//}
//
//en el componente padre, es decir donde tengas el componente que usa el formulario, y se activa con boton
// debes darle la variable show <app-agregar-mercancia [(show)]="showadd">
//de esta manera con [ ( var )] si no no va a funcionar!!! TODO

@Component({
    selector: 'app-ventana-transparente',
    imports: [
        CommonModule,
    ],
    templateUrl: './ventana-transparente.component.html',
    styleUrl: './ventana-transparente.component.css'
})
export class VentanaTransparenteComponent implements OnChanges {
  @Input()
  show =false;
  //para habilitar las dos vias de actualizacion
  @Output() showChange = new EventEmitter<boolean>();
  //para la animacion de desparacer y aparecer
  showClass =false;

  cerrarDesdeBoton() { 
    this.showClass=false
    //le da tiempo de hacer la animacion
    setTimeout(() => {
      this.showChange.emit(false)
      this.show=false
    }, 400);
  }

  ngOnChanges(){
    this.showClass=this.show
    if(this.show===false){
      this.cerrarDesdeBoton()
    }
  }

}
