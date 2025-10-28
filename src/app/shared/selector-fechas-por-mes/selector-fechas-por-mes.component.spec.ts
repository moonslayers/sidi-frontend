import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFechasPorMesComponent } from './selector-fechas-por-mes.component';

describe('SelectorFechasPorMesComponent', () => {
  let component: SelectorFechasPorMesComponent;
  let fixture: ComponentFixture<SelectorFechasPorMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorFechasPorMesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorFechasPorMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
