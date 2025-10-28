import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BootstrapClass } from '../../data-view/data-view.component';

export interface GraphBar{
  label:string;
  value:number;
  pipe?:'currency';
}

@Component({
    selector: 'app-graph-bar',
    imports: [
    CurrencyPipe
],
    templateUrl: './graph-bar.component.html',
    styleUrls: ['./graph-bar.component.css']
})
export class GraphBarComponent {
  @Input() data: GraphBar[] = [];
  @Input() mainColor: BootstrapClass='primary'

  @Input() maxValue = 100;
  @Input() partitions: (number|string)[] = [0, 25, 50, 75, 100];
}
