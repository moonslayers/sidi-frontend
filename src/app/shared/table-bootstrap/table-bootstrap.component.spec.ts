import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBootstrapComponent } from './table-bootstrap.component';

describe('TableBootstrapComponent', () => {
  let component: TableBootstrapComponent;
  let fixture: ComponentFixture<TableBootstrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBootstrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
