import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderableListComponent } from './orderable-list.component';

describe('OrderableListComponent', () => {
  let component: OrderableListComponent;
  let fixture: ComponentFixture<OrderableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
