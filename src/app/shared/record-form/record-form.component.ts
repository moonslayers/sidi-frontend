import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { SuperService } from '../../controllers/super.service';
import { BaseModel } from '../../models/base.model';

@Component({
    selector: 'app-record-form',
    imports: [],
    templateUrl: './record-form.component.html',
    styleUrl: './record-form.component.css'
})
export class RecordFormComponent<T extends BaseModel = BaseModel> implements OnInit {
  private controller = inject<SuperService<T>>(SuperService);

  @Input() record!: T & { id: number }
  @Output() editing = new EventEmitter()
  @Output() saved = new EventEmitter()
  @Output() deleted = new EventEmitter()

  edit = false
  isLoading = false
  isDeleting = false

  ngOnInit() {
    this.checkIfIsEditing()
  }

  protected checkIfIsEditing() {
    if (!this.record.id) {
      this.edit = true
    }
  }

  public async save() {
    this.isLoading = true
    const res = await this.controller.createOrUpdate(this.record)
    if (res) {
      this.record.id = res.id
      await this.afterSaved()
      this.saved.emit()
    }
    this.edit = false
    this.isLoading = false
  }

  protected async afterSaved() {
    // Intentionally empty - override in subclasses for custom post-save logic
  }

  protected afterSavedLocal() {
    // Intentionally empty - override in subclasses for custom local post-save logic
  }

  public async delete() {
    this.isDeleting = true
    if (!this.record.id) {
      this.deleted.emit()
      return
    }
    const res = await this.controller.switch(this.record, false)
    if (res) {
      this.deleted.emit()
    }
    this.isDeleting = false
  }
}