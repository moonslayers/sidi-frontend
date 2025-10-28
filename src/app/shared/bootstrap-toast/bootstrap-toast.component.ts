
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { Toast } from 'bootstrap';

export interface BootstrapToast {
  title?: string;
  message?: string;
  image?: string | null;
  timeAgo?: string;
  autohide?: boolean;
  delay?: number;
}

@Component({
    selector: 'app-bootstrap-toast',
    imports: [],
    templateUrl: './bootstrap-toast.component.html',
    styleUrls: ['./bootstrap-toast.component.css']
})
export class BootstrapToastComponent implements OnChanges,AfterViewInit {
  @Input() title? = 'Bootstrap';
  @Input() message? = 'Hello, world! This is a toast message.';
  @Input() image?: string | null = null; // URL de la imagen opcional
  @Input() timeAgo? = 'Just now';
  @Input() autohide? = true;
  @Input() delay = 5000;
  @Input() show =false
  @Output() showChange= new EventEmitter<boolean>()

  @ViewChild('toastElement') toastElement!: ElementRef<HTMLDivElement>;

  private toastInstance!: Toast;

  ngOnChanges(changes:SimpleChanges){
    if(changes['show'] && this.toastInstance){
      if(this.show){
        this.showToast()
      }else{
        this.hideToast()
      }
    }
  }

  ngAfterViewInit() {
    this.toastInstance = new Toast(this.toastElement.nativeElement, {
      autohide: typeof this.autohide ==='boolean'?this.autohide:true,
      delay: this.delay??5000,
    });
  }

  showToast() {
    this.toastInstance.show();
    setTimeout(()=>{
      this.show=this.toastInstance.isShown()
      this.showChange.emit(this.show)
    }, this.delay??6000)
  }

  hideToast() {
    this.toastInstance.hide();
    this.show=false
    this.showChange.emit(false)
  }
}