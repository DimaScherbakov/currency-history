import { TestBed } from '@angular/core/testing';

import { TransactionAreaService } from './transaction-area.service';

describe('TransactionAreaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionAreaService = TestBed.get(TransactionAreaService);
    expect(service).toBeTruthy();
  });
});
