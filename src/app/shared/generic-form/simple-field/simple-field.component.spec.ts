import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFieldComponent } from './simple-field.component';

describe('SimpleFieldComponent', () => {
  let component: SimpleFieldComponent;
  let fixture: ComponentFixture<SimpleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
