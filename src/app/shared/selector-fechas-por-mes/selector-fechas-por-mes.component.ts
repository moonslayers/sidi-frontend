import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector-fechas-por-mes',
  imports:[
    FormsModule,
  ],
  templateUrl: './selector-fechas-por-mes.component.html',
  styleUrls: ['./selector-fechas-por-mes.component.css']
})
export class SelectorFechasPorMesComponent implements OnChanges {
  // Meses en español
  meses = [
    { nombre: 'Enero', numero: 1 },
    { nombre: 'Febrero', numero: 2 },
    { nombre: 'Marzo', numero: 3 },
    { nombre: 'Abril', numero: 4 },
    { nombre: 'Mayo', numero: 5 },
    { nombre: 'Junio', numero: 6 },
    { nombre: 'Julio', numero: 7 },
    { nombre: 'Agosto', numero: 8 },
    { nombre: 'Septiembre', numero: 9 },
    { nombre: 'Octubre', numero: 10 },
    { nombre: 'Noviembre', numero: 11 },
    { nombre: 'Diciembre', numero: 12 }
  ];

  @Input() inicio = '';
  @Output() inicioChange = new EventEmitter<string>();

  @Input() fin = '';
  @Output() finChange = new EventEmitter<string>();

  mesSeleccionado: number | null = null;

  // Getter para obtener el año actual
  get year(): number {
    return new Date().getFullYear();
  }

  // Filtrar meses hasta el actual
  get mesesFiltrados() {
    const mesActual = new Date().getMonth() + 1;
    return this.meses.filter(m => m.numero <= mesActual);
  }

  // Se ejecuta al cambiar los valores de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inicio'] || changes['fin']) {
      this.actualizarMesSeleccionado();
    }
  }

  // Actualiza el select si hay fechas recibidas
  actualizarMesSeleccionado(): void {
    if (this.inicio && this.fin) {
      const fechaInicio = new Date(this.inicio.substring(0,10) + 'T17:00:00Z');
      const mes = fechaInicio.getMonth() + 1;
      console.log(this.inicio,mes)
      this.mesSeleccionado = mes;
    }
  }

  // Cuando el usuario selecciona un mes
  onMesSeleccionado(mes: number): void {
    const fechaInicio = new Date(this.year, mes-1, 1);
    const ultimoDia = new Date(this.year, mes, 0);
    console.log(fechaInicio)

    this.inicio = this.formatoFecha(fechaInicio);
    this.fin = this.formatoFecha(ultimoDia);

    this.mesSeleccionado = mes;
    this.inicioChange.emit(this.inicio);
    this.finChange.emit(this.fin);
  }

  // Formato YYYY-MM-DD
  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${mes}-${dia}`;
  }
}