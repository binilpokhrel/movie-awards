import { TestBed } from '@angular/core/testing';

import { MovieDataService } from '../core/services/movie-data.service';

describe('MovieDataService', () => {
  let service: MovieDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
