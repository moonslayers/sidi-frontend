import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { GraphBar, GraphBarComponent } from './graph-bar/graph-bar.component';
import { BootstrapClass } from '../data-view/data-view.component';

@Component({
    selector: 'app-bar-chart',
    imports: [TitleBarComponent, GraphBarComponent],
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css'],
    providers: [CurrencyPipe]
})
export class BarChartComponent implements OnChanges {
  private currencyPipe = inject(CurrencyPipe);

  @Input() title = '';
  @Input() data: GraphBar[] = [];
  @Input() mainColor: BootstrapClass = 'primary'

  @Input() maxValue = 0;
  @Input() partitionsDivide=7
  @Input() partitions: (string | number)[] = [];
  @Input() pipe?: 'currency'

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.setPartitions()
    }
  }

  private setPartitions() {
    const montoBase: number = Math.max(...this.data.map(r => r.value))
    this.maxValue = Math.ceil(montoBase * 1.20)
    this.partitions = []
    for (const i of Array.from({length: this.partitionsDivide}, (_, index) => index + 1)) {
      this.partitions.push(this.currencyPipe.transform(i * (this.maxValue / this.partitionsDivide)) ?? 0)
    }
  }
}
