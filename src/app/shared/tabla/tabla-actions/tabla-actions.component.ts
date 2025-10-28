import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { BaseModel } from '../../../models/base.model';
import { Button, TableRow } from '../tabla.component';

export interface RowButton {
  key: string;
  text?: string;
  title?: string;
  style?: {
    div?: string;
    icon?: string;
    button?: string;
    text?: string;
  };
  event?: EventEmitter<unknown>;
}

export interface RowButtonClickEvent<T> {
  key: string;
  row: T;
}

@Component({
  selector: 'app-tabla-actions',
  imports: [ButtonComponent],
  templateUrl: './tabla-actions.component.html',
  styleUrl: './tabla-actions.component.css'
})
export class TablaActionsComponent<T> {
  @Input() row!: T | BaseModel | TableRow;
  @Input() rowButtons: RowButton[] = [];
  @Input() rowEditar = true;
  @Input() rowEliminar = true;
  @Input() eliminar = true;
  @Input() restaurar = true;
  @Input() useGenericDelete = true;
  @Input() idKey = 'id';
  @Input() rowEditarButton: Button = {
    style: {
      button: 'btn btn-sm btn-success scale-05',
      icon: 'bi bi-pencil-fill'
    }
  };
  @Input() rowEditarEliminadoButton: Button = {
    style: {
      button: 'btn btn-sm btn-info scale-05',
      icon: 'bi bi-eye-fill'
    }
  };
  @Input() rowEliminarButton: Button = {
    style: {
      button: 'btn btn-sm btn-danger scale-05',
      icon: 'bi bi-trash-fill'
    }
  };
  @Input() rowRestaurarButton: Button = {
    style: {
      button: 'btn btn-sm btn-success scale-05',
      icon: 'bi bi-arrow-counterclockwise'
    }
  };
  @Input() rowButtonsStyle: {
    td?: string;
    div?: string;
  } | undefined;

  @Output() rowEditarClick = new EventEmitter<(T | BaseModel) & TableRow>();
  @Output() rowEliminarClick = new EventEmitter<T>();
  @Output() rowButtonClickEvent = new EventEmitter<RowButtonClickEvent<T>>();

  isRowDeleted(): boolean {
    const rowRecord = this.row as Record<string, unknown>;
    return !!rowRecord['deleted_at'];
  }

  onRowEdit(): void {
    const data= this.row as (T | BaseModel) & TableRow
    this.rowEditarClick.emit(data);
  }

  onRowDelete(): void {
    const typedRow = this.row as T;
    this.rowEliminarClick.emit(typedRow);
  }

  onRowButtonClick(buttonKey: string): void {
    const typedRow = this.row as T;
    this.rowButtonClickEvent.emit({ key: buttonKey, row: typedRow });
  }

  hasRowButtons(): boolean {
    return this.rowButtons.length > 0 ||
      (this.eliminar && this.rowEliminar) ||
      this.rowEditar;
  }
}