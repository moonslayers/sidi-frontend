import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

interface GraphPie {
  value: number;
  start: number;
  end: number;
  color?: string;
}

@Component({
    selector: 'app-graph-pie',
    templateUrl: './graph-pie.component.html',
    styleUrls: ['./graph-pie.component.css'],
    imports: [NgStyle]
})
export class GraphPieComponent {
  @Input() data: GraphPie[] = [];
}
