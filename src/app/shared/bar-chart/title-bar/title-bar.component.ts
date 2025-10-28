import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-title-bar',
    imports: [],
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent {
  @Input() title = '';
}
