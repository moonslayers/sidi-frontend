
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-record-form-buttons',
    imports: [],
    templateUrl: './record-form-buttons.component.html',
    styleUrl: './record-form-buttons.component.css'
})
export class RecordFormButtonsComponent {
  @Input() edit = false
  @Output() editChange = new EventEmitter<boolean>()
  @Input() isLoading = false
  @Input() isDeleting = false

  @Input() showSaveButton = true
  @Input() showEditButton = true

  @Output() saveButtonClick = new EventEmitter()
  @Output() deleteButtonClick = new EventEmitter()

  @Input() isSaveDisabled = false
}
