import { TestBed } from '@angular/core/testing';

import { ProfissionalLiberalService } from './profissional-liberal.service';

describe('ProfissionalLiberalService', () => {
  let service: ProfissionalLiberalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalLiberalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
