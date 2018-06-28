import { TestBed, inject } from '@angular/core/testing';

import { CoverSearchService } from './cover-search.service';

describe('CoverSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoverSearchService]
    });
  });

  it('should be created', inject([CoverSearchService], (service: CoverSearchService) => {
    expect(service).toBeTruthy();
  }));
});
