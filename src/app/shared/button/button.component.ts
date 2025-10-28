
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Popover } from 'bootstrap';

export interface Button {
  style?: ButtonStyle;
  text?: string;
}

export interface ButtonStyle {
  div?: string;
  button?: string;
  icon?: string;
}

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent implements AfterViewInit, OnDestroy {
  @Input() style: ButtonStyle | undefined
  @Input() text?: string | undefined
  @Input() disabled = false
  @Input() defaultButtonClass = 'btn btn-primary'
  @Input() defaultIconClass?: string
  @Input() title?: string
  @Input() sm? =false
  @Output() clickButtonEvent = new EventEmitter<void>()
  popover?: Popover

  @ViewChild('button') button!: ElementRef;

  ngAfterViewInit() {
    this.popover =new Popover(this.button.nativeElement);
  }
  ngOnDestroy(){
    this.popover?.hide()
  }
}
