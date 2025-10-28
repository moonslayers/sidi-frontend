import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicGroupFieldComponent } from './dinamic-group-field.component';

describe('DinamicGroupFieldComponent', () => {
  let component: DinamicGroupFieldComponent;
  let fixture: ComponentFixture<DinamicGroupFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinamicGroupFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinamicGroupFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
