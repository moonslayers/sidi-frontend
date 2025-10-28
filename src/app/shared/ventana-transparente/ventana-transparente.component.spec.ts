import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaTransparenteComponent } from './ventana-transparente.component';

describe('VentanaTransparenteComponent', () => {
  let component: VentanaTransparenteComponent;
  let fixture: ComponentFixture<VentanaTransparenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaTransparenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentanaTransparenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
