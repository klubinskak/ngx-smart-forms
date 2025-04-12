import { TestBed } from '@angular/core/testing';

import { NgxSmartFormsService } from './ngx-smart-forms.service';

describe('NgxSmartFormsService', () => {
  let service: NgxSmartFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSmartFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
