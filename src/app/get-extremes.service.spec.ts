import { TestBed } from '@angular/core/testing';

import { GetExtremesService } from './get-extremes.service';

describe('GetExtremesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetExtremesService = TestBed.get(GetExtremesService);
    expect(service).toBeTruthy();
  });
});
