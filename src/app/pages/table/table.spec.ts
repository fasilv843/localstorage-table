import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import { signal } from '@angular/core';
import { Search } from '../../components/search/search';
import { By } from '@angular/platform-browser';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the table component', () => {
    expect(component).toBeTruthy();
  });

  it('should render table headers', () => {
    const ths = fixture.nativeElement.querySelectorAll('th');
    expect(ths.length).toBe(3);
    expect(ths[0].textContent).toContain('Key');
    expect(ths[1].textContent).toContain('Value');
    expect(ths[2].textContent).toContain('Actions');
  });

  it('should render localStorage items', () => {
    component.localStorageItems = signal([
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' }
    ]);

    fixture.detectChanges(); // update the DOM

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // First row is Search inputs, so data rows start from index 1
    expect(rows.length).toBe(3); 
    expect(rows[1].cells[0].textContent).toContain('name');
    expect(rows[1].cells[1].textContent).toContain('Alice');
  });

  it('should render only search row when localStorage is empty', () => {
    component.localStorageItems = signal([]);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1); // only the search input row
  });

  it('should update keyQuery when key search emits', () => {
    const keySearchDE = fixture.debugElement.query(By.directive(Search));
    const searchComponent = keySearchDE.componentInstance as Search;

    searchComponent.query.emit('name'); // simulate Output emission

    expect(component.keyQuery()).toBe('name');
  });

  it('should filter rows by key and value', () => {
    component.localStorageItems = signal([
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
      { key: 'role', value: 'Admin' }
    ]);

    component.keyQuery.set('name'); // filter by key
    component.valueQuery.set('alice'); // filter by value

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // first row is search inputs
    expect(rows.length).toBe(2); 
    expect(rows[1].cells[0].textContent).toContain('name');
    expect(rows[1].cells[1].textContent).toContain('Alice');
  });
});
