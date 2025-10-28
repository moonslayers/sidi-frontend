import { Component, EventEmitter, Input, Output, SimpleChanges, inject, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface Tab{
  key: string;
  title:string;
  header:string;
  isSelected?:boolean;
  disabled?:boolean;
}

@Component({
    selector: 'app-steps-tabs',
    imports: [
        CommonModule,
    ],
    templateUrl: './steps-tabs.component.html',
    styleUrl: './steps-tabs.component.css'
})
export class StepsTabsComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  //Ejemplo de paginador
  /*[{
    key: "datos_cliente",
    title:"Ingrese datos del cliente",
    header:'Clientes'
    isSelected: true,
  },]*/
  @Input()
  paginador: Tab[] = []
  @Output() paginadorChange = new EventEmitter<unknown[]>();
  @Output() actual_pageChange = new EventEmitter<number>();

  @Input()
  actual_page = 0
  animation_out = false;
  animation_in = false
  animation_entry = false
  @Input()
  page_selected = 0

  @Input() routerTabulated =true
  ngOnInit() {
    if (!this.isunknownSelected()) {
      this.paginador[0].isSelected = true
    }
    if(this.routerTabulated){
      this.setTabuladorFromUrl()
    }
  }
  ngOnChanges(changes:SimpleChanges) {
    if (changes['page_selected'] && this.page_selected >= 0 && this.page_selected != this.actual_page) {
      this.change_tab(this.page_selected)
    }
  }

  setTabuladorFromUrl(){
    this.refreshTabuladorSelected(this.router.url)
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Solo toma el evento de finalización de navegación
      )
      .subscribe(() => {
        const fullUrl = this.router.url; // Obtiene la URL completa
        this.refreshTabuladorSelected(fullUrl); // Llama a tu función con la URL completa
      });
  }

  refreshTabuladorSelected(url:string){
    const i =this.paginador.findIndex((tab)=> url.includes(tab.key) )
    this.change_tab(i)
  }

  isunknownSelected(): boolean {
    return this.paginador.some((tab)=> tab.isSelected)
  }

  change_tab(tab = 0) {
    if (tab > this.actual_page) {
      this.animation_in = true
      setTimeout(() => {
        this.animation_in = false
      }, 500)
    }
    if (tab < this.actual_page) {
      this.animation_out = true
      setTimeout(() => {
        this.animation_out = false
      }, 500)
    }

    setTimeout(() => {
      if(!this.paginador[tab]) return
      this.actual_page = tab
      this.actual_pageChange.emit(this.actual_page)
      this.paginador.forEach((tab: Tab) => {
        if (tab.isSelected) {
          tab.isSelected = false
        }
      })
      this.paginador[tab].isSelected = true
      this.paginador[tab].disabled = false
      this.paginadorChange.emit(this.paginador)
    }, 250)
  }
}
