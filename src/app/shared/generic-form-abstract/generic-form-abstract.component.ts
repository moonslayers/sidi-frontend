import { Component, inject, OnInit } from '@angular/core';
import { SuperService } from '../../controllers/super.service';
import { ActivatedRoute } from '@angular/router';
import { BaseModel } from '../../models/base.model';

@Component({
    selector: 'app-generic-form-abstract',
    imports: [],
    templateUrl: './generic-form-abstract.component.html',
    styleUrl: './generic-form-abstract.component.css'
})
export class GenericFormAbstract<T = BaseModel> implements OnInit {
  controller = inject<SuperService<T>>(SuperService);
  private route = inject(ActivatedRoute);

  edit?: T
  idKey = 'id'
  protected relations: string[] = []

  ngOnInit(){
    this.routeParamSuscriber()
  }

  protected async routeParamSuscriber(){
    this.route.params.subscribe(async (params) =>{
      const id= params[this.idKey]
      if(id){
        this.edit= await this.controller.find(id,this.relations)
      }
    })
  }
}
