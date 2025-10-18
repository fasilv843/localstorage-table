import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input element', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search');
  });

  it('should emit query value after debounce', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');
    const emitSpy = spyOn(component.query, 'emit');

    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Fast-forward 300ms debounce time
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith('Angular');
  }));

  it('should not emit duplicate values', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');
    const emitSpy = spyOn(component.query, 'emit');

    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    // Only one emission expected
    expect(emitSpy).toHaveBeenCalledTimes(1);
  }));

  it('should emit and complete destroy$ on ngOnDestroy', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled()
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not emit before debounce time', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');
    const emitSpy = spyOn(component.query, 'emit');

    // Simulate user typing
    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Advance 200ms — less than the 300ms debounce
    tick(200);

    // Expect that emit was NOT called yet
    expect(emitSpy).not.toHaveBeenCalled();

    // Advance the remaining 100ms to reach debounce threshold
    tick(100);

    // Now the debounce completes, expect an emission
    expect(emitSpy).toHaveBeenCalledWith('Angular');
  }));

  it('should emit only last value after debounce time', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');
    const emitSpy = spyOn(component.query, 'emit');

    // Simulate user typing
    input.value = 'Value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input.value = 'Value2';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input.value = 'Another Value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input.value = 'Last Value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();


    // Advance 200ms — less than the 300ms debounce
    tick(200);

    // Expect that emit was NOT called yet
    expect(emitSpy).not.toHaveBeenCalled();

    // Advance the remaining 100ms to reach debounce threshold
    tick(100);

    // Now the debounce completes, expect an emission
    expect(emitSpy).toHaveBeenCalledWith('Last Value');
  }));
});
