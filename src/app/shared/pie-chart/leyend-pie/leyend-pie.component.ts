import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

interface LegendPie {
  label: string;
  value: number;
  color?: string;
}

@Component({
    selector: 'app-leyend-pie',
    templateUrl: './leyend-pie.component.html',
    styleUrls: ['./leyend-pie.component.css'],
    imports: [NgStyle]
})
export class LeyendPieComponent {
  @Input() data: LegendPie[] = [];
}

