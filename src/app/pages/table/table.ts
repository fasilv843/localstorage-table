import { Component, inject, signal } from '@angular/core';
import { StorageService } from '../../services/storage';
import { Search } from "../../components/search/search";
import { FilterPipe } from '../../pipes/filter-pipe';
import { toSignal } from '@angular/core/rxjs-interop'
import { QueryHighlight } from "../../directives/query-highlight";


@Component({
  selector: 'app-table',
  imports: [Search, FilterPipe, QueryHighlight],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  storageService = inject(StorageService)
  localStorageItems = toSignal(this.storageService.localStorage$, { initialValue: [] })

  keyQuery = signal('')
  valueQuery = signal('')

  onUpdate(key: string) {
    const newValue = prompt('Enter Value');
    if (newValue) {
      this.storageService.setItem(key, newValue)
    }
  }

  onAdd() {
    const key = prompt('Enter key');
    if (!key) return; // user cancelled or empty key

    const value = prompt('Enter value');
    if (value === null) return; // user cancelled
    this.storageService.setItem(key, value);
  }

  onDelete(key: string) {
    if (confirm('Are you sure?')) {
      this.storageService.removeItem(key)
    }
  }

  onClear() {
    if (confirm('Are you sure?')) {
      this.storageService.clear()
    }
  }
}
