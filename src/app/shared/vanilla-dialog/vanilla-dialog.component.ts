import { Component, ElementRef, Input, ViewChild, inject, OnChanges } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VanillaDialogService } from '../../services/vanilla-dialog/vanilla-dialog.service';

@Component({
    selector: 'app-vanilla-dialog',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './vanilla-dialog.component.html',
    styleUrl: './vanilla-dialog.component.css'
})
export class VanillaDialogComponent implements OnChanges {
  private dialogService = inject(VanillaDialogService);

  @Input()
  tipo: string | undefined = "";
  @Input()
  show = false
  hide =false
  @Input()
  title: string | undefined;
  @Input()
  body: string | undefined;
  @Input()
  respYes: string | undefined = 'Aceptar';
  @Input()
  respNot: string | undefined;
  @Input()
  size: string | undefined = "m";

  @ViewChild('dialogoElement')
  dialogoElement!: ElementRef;

  ngOnChanges(){
    if(this.show){
      //si esta oculto lo muestra de inmediato
      if(this.hide){
        this.hide=false
      }
      //si no esta oculto es decir la venta ya esta abierta, espera que la ventana se termine de abrir o cerrar para mostrarla
      setTimeout(()=>{
        if(this.show){
          this.hide=false
        }
      },500)
    }else{
      //si esta abierto lo activa la animacion para cerrarlo
      if(!this.hide){
        setTimeout(()=>{
          if(!this.show){
            this.hide=true
          }
        },500)
      }else{
        //esta en proceso de abrirse, damos tiempo que termine la animacion antes de cerrarlo
        setTimeout(()=>{
          setTimeout(()=>{
            if(!this.show){
              this.hide=true
            }
          },500)
        },500)
      }
    }
  }

  getSize(): string {
    switch (this.size) {
      case 's':
        return 'col-lg-3 p-4'
      case 'm':
        return 'col-lg-5 p-4'
      case 'l':
        return 'col-lg-7 p-4'
      case 'xl':
        return 'col-lg-9 p-3'
      default:
        return 'col-lg-5 p-4'
    }
  }
  animationClass() {
    if (this.show) {
      return 'fade-in'
    } else {
      return 'fade-out'
    }
  }

  icon_class(): string {
    const tipoMap: Record<string, string> = {
      "success": 'bi-check-circle text-success',
      "warning": 'bi-exclamation-circle text-warning',
      "danger": 'bi-x-circle text-danger',
      "info": 'bi-info-square text-info',
      "confirm": 'bi bi-question-circle text-secondary',
    };
    return tipoMap[this.tipo || ''] || 'bi-exclamation-triangle text-primary';
  }

  tipoTitle(): string {
    const tipoMap: Record<string, string> = {
      "success": 'text-success',
      "warning": 'text-warning',
      "danger": 'text-danger',
      "info": 'text-info',
      "confirm": 'text-secondary',
    };
    return tipoMap[this.tipo || ''] || 'text-primary';
  }
  borderColor(): string {
    const tipoMap: Record<string, string> = {
      "success": 'border-success-subtle',
      "warning": 'border-warning-subtle',
      "danger": 'border-danger-subtle',
      "info": 'border-info-subtle',
      "confirm": 'border-secondary-subtle',
    };
    return tipoMap[this.tipo || ''] || 'border-primary-subtle';
  }

  //se comunica con el servicio para indicarle que se debe cerrar y de que forma fue cerrado
  accion(value: string) {
    const dataMap: Record<string, { closedByAgree: boolean; closedByCancelled: boolean; closedByOutside: boolean }> = {
      "si": {
        closedByAgree: true,
        closedByCancelled: false,
        closedByOutside: false,
      },
      "no": {
        closedByAgree: false,
        closedByCancelled: true,
        closedByOutside: false,
      }
    };

    const data = dataMap[value];
    if (data) {
      this.dialogService.close(data);
    } else {
      this.dialogService.close(null);
    }
  }
}
