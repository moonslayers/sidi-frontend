import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para los datos del diálogo
export interface DialogData {
  title: string;
  body: string;
  size?: string;
  respYes?: string;
  respNo?: string;
  tipo?: string;
}

export interface closedData {
  closedByCancelled: boolean;
  closedByOutside:boolean;
  closedByAgree:boolean;
}


@Injectable({
  providedIn: 'root'
})
/*Geenra un dialogo condiferentes opciones para personalizarlo
EJEMPLO DE USO:
#1) importar el servicio
  import { VanillaDialogService } from '...'  

#2) inyectarlo en el constructor del componente e instanciar una variable con el servicio
  constructor( dialog: VanillaDialogService){
        this.dialogService=dialog; #En este caso usamos la variable 'dialogService'
  }

  #3) 

*/
export class VanillaDialogService {
  private showDialogSubject = new BehaviorSubject<boolean>(false);
  private dialogDataSubject = new BehaviorSubject<DialogData | null>(null);
  private closedDataSubject = new BehaviorSubject<closedData | null>(null);

  // Observable para que los componentes puedan suscribirse a cambios en el estado del diálogo
  showDialog$: Observable<boolean> = this.showDialogSubject.asObservable();
  dialogData$: Observable<DialogData | null> = this.dialogDataSubject.asObservable();
  closedData$: Observable<closedData | null> = this.closedDataSubject.asObservable();

  // Método para cambiar el estado del diálogo
  toggleDialog(show: boolean): void {
    this.showDialogSubject.next(show);
  }
  show(data: DialogData) {
    this.dialogDataSubject.next(data);
    this.toggleDialog(true)
    return this.closedData$
  }
  close(data: closedData | null = null){
    this.closedDataSubject.next(data)
    this.toggleDialog(false)
    this.closedDataSubject.next(null)
  }
  isOpen():boolean{
    return this.showDialogSubject.closed
  }
}
