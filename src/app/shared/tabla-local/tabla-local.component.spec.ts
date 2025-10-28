import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaLocalComponent } from './tabla-local.component';

describe('TablaLocalComponent', () => {
  let component: TablaLocalComponent;
  let fixture: ComponentFixture<TablaLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
