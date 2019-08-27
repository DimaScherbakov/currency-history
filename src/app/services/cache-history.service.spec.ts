import { TestBed } from '@angular/core/testing';

import { CacheHistoryService } from './cache-history.service';

describe('CacheHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheHistoryService = TestBed.get(CacheHistoryService);
    expect(service).toBeTruthy();
  });
});
