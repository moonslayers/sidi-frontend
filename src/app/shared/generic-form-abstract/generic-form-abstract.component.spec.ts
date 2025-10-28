import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFormAbstractComponent } from './generic-form-abstract.component';

describe('GenericFormAbstractComponent', () => {
  let component: GenericFormAbstractComponent;
  let fixture: ComponentFixture<GenericFormAbstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFormAbstractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFormAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
