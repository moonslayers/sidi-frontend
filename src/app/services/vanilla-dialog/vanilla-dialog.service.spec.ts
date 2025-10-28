import { TestBed } from '@angular/core/testing';

import { VanillaDialogService } from './vanilla-dialog.service';

describe('VanillaDialogService', () => {
  let service: VanillaDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VanillaDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
