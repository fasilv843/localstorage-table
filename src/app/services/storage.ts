import { Injectable } from '@angular/core';
import { fromEvent, map, merge, startWith, Subject } from 'rxjs';

export interface LocalStorageEntry {
  key: string;
  value: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private manualTrigger$ = new Subject<void>();

  readonly localStorage$ = merge(
    fromEvent(window, 'storage'),
    this.manualTrigger$
  ).pipe(
    startWith(this.getAllStorage()),
    map(() => this.getAllStorage()),
  )

  private getAllStorage(): LocalStorageEntry[] {
    const result: LocalStorageEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      const value = localStorage.getItem(key);
      result.push({ key, value });
    }
    return result;
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
    this.manualTrigger$.next()
  }

  clear() {
    localStorage.clear()
    this.manualTrigger$.next()
  }
}
