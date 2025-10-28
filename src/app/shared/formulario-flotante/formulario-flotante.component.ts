import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnChanges } from '@angular/core';
import { BootstrapClass } from '../data-view/data-view.component';

type Size = 'small' | 'medium' | 'large' | 'x-large'
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
    selector: 'app-formulario-flotante',
    imports: [
        CommonModule,
    ],
    templateUrl: './formulario-flotante.component.html',
    styleUrl: './formulario-flotante.component.css'
})
export class FormularioFlotanteComponent implements OnChanges {
  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.cerrarDesdeBoton()
  }
  @Input()
  show = false;
  //para habilitar las dos vias de actualizacion
  @Output() showChange = new EventEmitter<boolean>();
  showClass = false;

  @Input() closeButton =true

  @Input()
  size: Size = 'medium'

  IsAnimationPlaying = false

  @Input() bgClass:BootstrapClass='white'
  get_sizing(): string {
    switch (this.size) {
      case 'x-large':
        return 'col-12 col-sm-12 col-lg-11 col-xl-10'
      case 'large':
        return 'col-12 col-sm-11 col-lg-10 col-xl-9'
      case 'medium':
        return 'col-12 col-sm-10 col-lg-8 col-xl-6'
      case 'small':
        return 'col-12 col-sm-9 col-lg-7 col-xl-5'
      default:
        return 'col-12 col-sm-10 col-lg-8 col-xl-6'
    }
  }
  animateShow() {
    this.showClass = true
    this.IsAnimationPlaying = true
    setTimeout(() => {
      this.IsAnimationPlaying = false
    }, 200);
  }

  animateClose() {
    this.showClass = false
    this.IsAnimationPlaying = true
    setTimeout(() => {
      this.show = false
      this.showChange.emit(false)
      this.IsAnimationPlaying = false
    }, 300);
  }

  cerrarDesdeBoton() {
    if (!this.IsAnimationPlaying) {
      this.animateClose()
    }else if(this.show==true){
      this.show = false
    }
  }
  mostrarVentana() {
    if (!this.IsAnimationPlaying) {
      this.animateShow()
    }else{
      this.show = false
    }
  }
  ngOnChanges() {
    if (this.show) {
      this.mostrarVentana()
    }
  }


}
