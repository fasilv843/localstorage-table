import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, output, viewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements AfterViewInit, OnDestroy {
  searchInput = viewChild('searchInput', { read: ElementRef });
  destroy$ = new Subject<void>();
  query = output<string>();

  ngAfterViewInit(): void {
    const searchField = this.searchInput()?.nativeElement
    fromEvent<InputEvent>(searchField, 'input').pipe(
      debounceTime(300),
      map((e) => (e.target as HTMLInputElement).value),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.query.emit(value)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
