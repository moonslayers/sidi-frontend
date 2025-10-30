import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInhibidoresForm } from './formulario-inhibidores-form';

describe('FormularioProblematicaForm', () => {
  let component: FormularioInhibidoresForm;
  let fixture: ComponentFixture<FormularioInhibidoresForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioInhibidoresForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioInhibidoresForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
