import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private showLoaderSubject = new BehaviorSubject<boolean>(false);

  // Observable para que los componentes puedan suscribirse a cambios en el estado del diálogo
  showLoader$: Observable<boolean> = this.showLoaderSubject.asObservable();

  // Método para cambiar el estado del diálogo
  toggleLoader(show: boolean): void {
    this.showLoaderSubject.next(show);
  }
}
// Interfaz para los datos del diálogo
export interface Paginador {
  show: boolean;
}