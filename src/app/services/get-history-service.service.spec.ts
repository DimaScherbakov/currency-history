import { TestBed } from '@angular/core/testing';

import { GetHistoryServiceService } from './get-history-service.service';

describe('GetHistoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetHistoryServiceService = TestBed.get(GetHistoryServiceService);
    expect(service).toBeTruthy();
  });
});
