import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Paginator } from '../../controllers/super.service';

@Component({
    selector: 'app-paginador',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './paginador.component.html',
    styleUrl: './paginador.component.css'
})
export class PaginadorComponent implements OnChanges {

  @Input()
  paginador: number[] = [];
  paginador_view:number[]=[]
  //Lista de ordenamiento ejemplo ['ordenamiento ascendente','ordenamiento descendente']
  //la posicion en la lista debe coincidir con las listas que puedes encontrar en la documentacion de las apis.
  @Input()
  orderLabels: string[] = []
  // puedes indicarle a la tabla el orden inicial de la tabla si es que existe uno
  @Input()
  selected_order = 1
  @Input()
  per_page = 5
  @Input()
  page_options: number[] = [5, 10, 15, 20, 30];
  page_actual = 1
  @Input()
  data_paginador:Paginator={
    page:1,
    per_page:5,
  }
  @Input()
  total_pages=0
  @Input()
  default =true
  @Input()
  short =false
  @Input()
  sm =false
  @Output() per_pageChange = new EventEmitter<number>()
  @Output() page_actualChange = new EventEmitter<number>()
  @Output() actualizar_tablaChange = new EventEmitter<boolean>()
  @Output() data_paginadorChange = new EventEmitter<unknown>()
  @Input() total_items=0

  ngOnChanges(){
    if(this.total_pages>0){
      this.generar_paginador()
    }
  }

  generar_paginador(){
    this.data_paginador.per_page=this.per_page
    this.data_paginadorChange.emit(this.data_paginador)
    if(this.total_pages!==this.paginador.length){
      this.paginador=[]
      for( let i=1; i<=this.total_pages; i++){
        this.paginador.push(i)
      }
      this.vista_paginador()
    }
  }
  vista_paginador(){
    if(this.total_pages>=7){
      if(this.page_actual>2 && this.page_actual<this.total_pages -3){
        this.paginador_view=[ this.page_actual-2, this.page_actual-1, this.page_actual, this.page_actual+1, this.page_actual+2 ]
      }else if( this.total_pages>4 && this.page_actual> this.total_pages-4){
        this.paginador_view=[ this.total_pages-4, this.total_pages-3, this.total_pages-2, this.total_pages-1, this.total_pages ]
      }else{
        this.paginador_view=[ 1,2,3,4,5 ]
      }
    }else if(this.total_pages<=6){
      this.paginador_view=[...this.paginador]
    }
  }

  actualizar_tabla(){
    this.page_actual = 1
    this.data_paginador={
      page:this.page_actual,
      per_page:this.per_page,
    }
    this.per_pageChange.emit(this.per_page)
    this.data_paginadorChange.emit(this.data_paginador)
    this.page_actualChange.emit(this.page_actual)
    this.actualizar_tablaChange.emit(true)
    this.vista_paginador()
  }

  cambiar_page(page: number) {
    this.data_paginador={
      page:page,
      per_page:this.per_page,
    }
    this.per_pageChange.emit(this.per_page)
    this.data_paginadorChange.emit(this.data_paginador)
    this.page_actualChange.emit(this.page_actual)
    if(this.page_actual!= page){
      this.page_actual = page
      this.actualizar_tablaChange.emit(true)
    }
    this.vista_paginador()
  }

}
