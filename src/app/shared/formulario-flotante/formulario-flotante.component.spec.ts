import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioFlotanteComponent } from './formulario-flotante.component';

describe('FormularioFlotanteComponent', () => {
  let component: FormularioFlotanteComponent;
  let fixture: ComponentFixture<FormularioFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioFlotanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
