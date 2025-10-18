import { Component, inject, signal } from '@angular/core';
import { StorageService } from '../../services/storage';
import { Search } from "../../components/search/search";
import { FilterPipe } from '../../pipes/filter-pipe';
import { toSignal } from '@angular/core/rxjs-interop'


@Component({
  selector: 'app-table',
  imports: [Search, FilterPipe],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  storageService = inject(StorageService)
  localStorageItems = toSignal(this.storageService.localStorage$, { initialValue: [] })

  keyQuery = signal('')
  valueQuery = signal('')
}
