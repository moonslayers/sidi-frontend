import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInhibidores } from './formulario-inhibidores';

describe('FormularioProblematica', () => {
  let component: FormularioInhibidores;
  let fixture: ComponentFixture<FormularioInhibidores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioInhibidores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioInhibidores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
