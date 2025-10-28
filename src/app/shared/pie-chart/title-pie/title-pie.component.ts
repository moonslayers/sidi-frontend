import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-pie',
  templateUrl: './title-pie.component.html',
  styleUrls: ['./title-pie.component.css'],
  standalone: true
})
export class TitlePieComponent {
  @Input() title = '';
}
