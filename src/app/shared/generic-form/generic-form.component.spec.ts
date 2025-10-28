import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFormComponent } from './generic-form.component';

describe('GenericFormComponent', () => {
  let component: GenericFormComponent<unknown>;
  let fixture: ComponentFixture<GenericFormComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
