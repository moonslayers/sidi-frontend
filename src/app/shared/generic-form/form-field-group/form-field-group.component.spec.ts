import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldGroupComponent } from './form-field-group.component';

describe('FormFieldGroupComponent', () => {
  let component: FormFieldGroupComponent;
  let fixture: ComponentFixture<FormFieldGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
