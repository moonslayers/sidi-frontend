import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { GraphPieComponent } from './graph-pie/graph-pie.component';
import { LeyendPieComponent } from './leyend-pie/leyend-pie.component';
import { TitlePieComponent } from './title-pie/title-pie.component';

interface PieChart {
  label: string;
  value: number;
  color?: string;
}

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css'],
    imports: [NgClass, GraphPieComponent, LeyendPieComponent, TitlePieComponent]
})

export class PieChartComponent {
  @Input() title = '';
  @Input() colors: string[] = [];
  @Input() chartPosition: 'left' | 'right' | 'bottom' = 'right';
  @Input() data: PieChart[] = [];

  get processedData() {
    const total = this.data.reduce((acc, curr) => acc + curr.value, 0);
    let start = 0;
    return this.data.map((item, index) => {
      const fraction = item.value / total;
      const end = start + fraction;
      const color = item.color || this.colors[index] || '#ccc';
      const segment = {
        ...item,
        start,
        end,
        color
      };
      start = end;
      return segment;
    });
  }
}
