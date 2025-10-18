import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage';
import { take } from 'rxjs';

describe('Storage', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should emit initial empty localStorage', (done) => {
    service.localStorage$.pipe(take(1)).subscribe((entries) => {
      expect(entries).toEqual([]);
      done();
    });
  });

  it('should add an item and emit updated localStorage', (done) => {
    const key = 'testKey';
    const value = 'testValue';

    service.localStorage$.pipe(take(2)).subscribe({
      next: (entries) => {
        if (entries.length === 1) {
          expect(entries[0]).toEqual({ key, value });
          expect(localStorage.getItem(key)).toBe(value);
          done();
        }
      }
    });

    service.setItem(key, value);
  });

  it('should clear localStorage and emit empty array', (done) => {
    localStorage.setItem('someKey', 'someValue');

    service.localStorage$.pipe(take(2)).subscribe({
      next: (entries) => {
        // After clear(), localStorage should be empty
        if (entries.length === 0) {
          expect(localStorage.length).toBe(0);
          done();
        }
      }
    });

    service.clear();
  });

  it('should react to manualTrigger$ when setting item', (done) => {
    const key = 'manual';
    const value = 'trigger';

    service.localStorage$.pipe(take(2)).subscribe({
      next: (entries) => {
        if (entries.find(e => e.key === key)) {
          expect(entries[0]).toEqual({ key, value });
          done();
        }
      }
    });

    service.setItem(key, value);
  });

});
