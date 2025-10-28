import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanillaDialogComponent } from './vanilla-dialog.component';

describe('VanillaDialogComponent', () => {
  let component: VanillaDialogComponent;
  let fixture: ComponentFixture<VanillaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VanillaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VanillaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
