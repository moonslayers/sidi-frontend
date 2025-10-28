import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataViewS2cComponent } from './data-view-s2c.component';

describe('DataViewS2cComponent', () => {
  let component: DataViewS2cComponent;
  let fixture: ComponentFixture<DataViewS2cComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataViewS2cComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataViewS2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
