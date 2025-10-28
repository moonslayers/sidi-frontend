import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsTabsComponent } from './steps-tabs.component';

describe('StepsTabsComponent', () => {
  let component: StepsTabsComponent;
  let fixture: ComponentFixture<StepsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
