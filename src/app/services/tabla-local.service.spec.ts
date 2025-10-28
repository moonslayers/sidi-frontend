import { TestBed } from '@angular/core/testing';

import { TablaLocalService } from './tabla-local.service';

describe('TablaLocalService', () => {
  let service: TablaLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
