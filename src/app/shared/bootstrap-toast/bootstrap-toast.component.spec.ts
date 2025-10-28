import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapToastComponent } from './bootstrap-toast.component';

describe('BootstrapToastComponent', () => {
  let component: BootstrapToastComponent;
  let fixture: ComponentFixture<BootstrapToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BootstrapToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
