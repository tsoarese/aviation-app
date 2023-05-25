import { TestBed } from '@angular/core/testing';

import { AviationstackService } from './aviationstack.service';

describe('AviationstackService', () => {
  let service: AviationstackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AviationstackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
