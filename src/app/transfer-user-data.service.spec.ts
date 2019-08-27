import { TestBed } from '@angular/core/testing';

import { TransferUserDataService } from './transfer-user-data.service';

describe('TransferUserDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferUserDataService = TestBed.get(TransferUserDataService);
    expect(service).toBeTruthy();
  });
});
