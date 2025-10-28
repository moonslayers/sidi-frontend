import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { GroupStyle, FormGroupComponent } from "../form-group/form-group.component";

import { Button } from '../../button/button.component';

export interface OrderableList {
  title: string;
  style?: GroupStyle;
  orderableList: OrderableItem[];
  key: string;
  value?: string[] | string;
  valid?: boolean;
  upButton?: Button;
  downButton?: Button;
}

export interface OrderableItem {
  label?: string;
  text: string;
  style?: {
    label?: string;
    text?: string;
  }
}

@Component({
    selector: 'app-orderable-list',
    imports: [
        FormGroupComponent
    ],
    templateUrl: './orderable-list.component.html',
    styleUrl: './orderable-list.component.css'
})
export class OrderableListComponent implements OnInit, OnChanges {
  @Input() groupStyle?: GroupStyle
  @Input() title!: string

  @Input() list: OrderableItem[] = []
  @Output() listChange = new EventEmitter<OrderableItem[]>()

  @Input() upButton?: Button
  @Input() downButton?: Button

  @Input() value?: string[] | string
  @Output() valueChange = new EventEmitter<string[]>()

  @Input() valid?: boolean;
  @Output() validChange = new EventEmitter<boolean>()

  ngOnInit() {
    this.setValid()
    this.setValue()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.reArrange()
    }
  }

  reArrange() {
    if (this.value && this.isString(this.value)) {
      this.value = (JSON.parse(this.value)??[]) as string[]
      this.valueChange.emit(this.value)

      if (Array.isArray(this.value)) {
        for (const [i, item] of this.value.entries()) {
          this.list[i].text = item;
        }
      }
      console.log(this.value)
    }
  }

  setValid() {
    this.valid = true
    this.validChange.emit(true)
  }

  isStringList(value: string | string[]): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  moveUp(row: OrderableItem) {
    const index = this.list.indexOf(row);
    if (index > 0) {
      [this.list[index - 1], this.list[index]] = [this.list[index], this.list[index - 1]];
      if (this.value && this.isStringList(this.value)) {
        [this.value[index - 1], this.value[index]] = [this.value[index], this.value[index - 1]];
      }
    }
    this.listChange.emit(this.list)
  }

  moveDown(row: OrderableItem) {
    const index = this.list.indexOf(row);
    if (index < this.list.length - 1) {
      [this.list[index], this.list[index + 1]] = [this.list[index + 1], this.list[index]];
      if (this.value && this.isStringList(this.value)) {
        [this.value[index - 1], this.value[index]] = [this.value[index], this.value[index - 1]];
      }
    }
    this.listChange.emit(this.list)
  }

  setValue() {
    const values: string[] = []
    this.list.forEach((item) => {
      values.push(item.text)
    })
    this.value = values
    this.valueChange.emit(values)
  }
}
