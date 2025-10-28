
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-collapsable',
    imports: [],
    templateUrl: './collapsable.component.html',
    styleUrl: './collapsable.component.css'
})
export class CollapsableComponent {
  @Input() title=''
  animateClass=''
  isShow=true

  public switchAnimation(){
    if(this.animateClass=='animate__flipInX' || !this.animateClass){
      this.animateClass='animate__flipOutX'
      setTimeout(()=>{
        this.isShow=false
      },400)
    }else{
      this.animateClass='animate__flipInX'
      this.isShow=true
    }
  }
}
