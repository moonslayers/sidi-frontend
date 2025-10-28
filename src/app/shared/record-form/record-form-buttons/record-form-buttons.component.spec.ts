import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordFormButtonsComponent } from './record-form-buttons.component';

describe('RecordFormButtonsComponent', () => {
  let component: RecordFormButtonsComponent;
  let fixture: ComponentFixture<RecordFormButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordFormButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordFormButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
