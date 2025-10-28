
import { Component, Input } from '@angular/core';

export interface MultipleSelectStyle{
  div?:string;
}

@Component({
    selector: 'app-multiple-select-field',
    imports: [],
    templateUrl: './multiple-select-field.component.html',
    styleUrl: './multiple-select-field.component.css'
})
export class MultipleSelectFieldComponent {
  @Input() style:MultipleSelectStyle|undefined

  @Input() options:string[]=['opcion A', 'opcion B']
  selectedOptions: string[] = [];
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onOptionChange(event: Event, option: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(item => item !== option);
    }
  }
}
