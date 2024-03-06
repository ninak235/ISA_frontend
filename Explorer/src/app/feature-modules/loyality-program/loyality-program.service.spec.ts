import { TestBed } from '@angular/core/testing';

import { LoyalityProgramService } from './loyality-program.service';

describe('LoyalityProgramService', () => {
  let service: LoyalityProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyalityProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
