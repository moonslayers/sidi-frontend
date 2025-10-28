import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Header, Sorting, TableHeader } from '../tabla.component';

import { TitlecasePipe } from '../../../pipes/titlecase.pipe';

@Component({
    selector: 'app-tabla-header',
    imports: [
    TitlecasePipe
],
    templateUrl: './tabla-header.component.html',
    styleUrl: './tabla-header.component.css'
})
export class TablaHeaderComponent implements OnChanges {
  @Input() header!: TableHeader
  @Input() sort!: Sorting
  @Input() column= ''
  @Output() sortChange= new EventEmitter<Sorting>()

  desc =false

  isSorted =false

  ngOnChanges(changes:SimpleChanges){
    if(changes['sort'] || changes['column']){
      this.setAscDesc()
    }
  }

  setAscDesc(){
    this.isSorted=false
    this.desc=false
    if(this.isHeader(this.header) && this.header.key==this.sort.column){
      this.desc=!!this.sort.desc 
      this.isSorted=true
    }
    if(this.isString(this.header) &&  this.header == this.sort.column){
      this.desc=!!this.sort.desc
      this.isSorted=true
    }
  }

  updateSorting(){
    this.desc=!this.desc
    this.sort.desc=this.desc
    this.sort.column= this.isHeader(this.header)? this.header.key: this.header
    this.sortChange.emit(this.sort)
  }

  isHeader(header: TableHeader): header is Header {
    return (header as Header).key !== undefined
  }

  isString(header: TableHeader): header is string {
    return typeof header === 'string';
  }
}
