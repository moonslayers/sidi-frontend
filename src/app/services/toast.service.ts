import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BootstrapToast } from '../shared/bootstrap-toast/bootstrap-toast.component';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private showToastSubject = new BehaviorSubject<boolean>(false);
  private toastDataSubject = new BehaviorSubject<BootstrapToast | null>(null);

  // Observable para que los componentes puedan suscribirse a cambios en el estado del diálogo
  showToast$: Observable<boolean> = this.showToastSubject.asObservable();
  toastData$: Observable<BootstrapToast | null> = this.toastDataSubject.asObservable();

  // Método para cambiar el estado del diálogo
  toggleToast(show: boolean): void {
    this.showToastSubject.next(show);
  }
  show(data: BootstrapToast) {
    this.toastDataSubject.next(data);
    this.toggleToast(true)
  }
}
