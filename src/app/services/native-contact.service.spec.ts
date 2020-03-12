import { TestBed } from '@angular/core/testing';

import { NativeContactService } from './native-contact.service';

describe('NativeContactService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeContactService = TestBed.get(NativeContactService);
    expect(service).toBeTruthy();
  });
});
