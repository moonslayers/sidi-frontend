import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-bootstrap',
    imports: [],
    templateUrl: './table-bootstrap.component.html',
    styleUrl: './table-bootstrap.component.css'
})
export class TableBootstrapComponent {
  @Input() dataSource:unknown[]=[]
}
