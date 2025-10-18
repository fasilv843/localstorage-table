import { FilterPipe } from './filter-pipe';
import { LocalStorageEntry } from '../services/storage';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if input array is empty', () => {
    const result = pipe.transform([], 'key', 'value');
    expect(result).toEqual([]);
  });

  it('should filter by key only', () => {
    const data: LocalStorageEntry[] = [
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
      { key: 'Name', value: 'Bob' },
    ];

    const result = pipe.transform(data, 'name', '');
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { key: 'name', value: 'Alice' },
      { key: 'Name', value: 'Bob' },
    ]);
  });

  it('should filter by value only', () => {
    const data: LocalStorageEntry[] = [
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
      { key: 'role', value: 'Admin' },
    ];

    const result = pipe.transform(data, '', 'alice');
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
    ]);
  });

  it('should filter by both key and value', () => {
    const data: LocalStorageEntry[] = [
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
      { key: 'name', value: 'Bob' },
    ];

    const result = pipe.transform(data, 'name', 'bob');
    expect(result.length).toBe(1);
    expect(result).toEqual([
      { key: 'name', value: 'Bob' },
    ]);
  });

  it('should return all items if both key and value are empty', () => {
    const data: LocalStorageEntry[] = [
      { key: 'name', value: 'Alice' },
      { key: 'email', value: 'alice@example.com' },
    ];

    const result = pipe.transform(data, '', '');
    expect(result).toEqual(data);
  });

  it('should handle null or undefined values gracefully', () => {
    const data: LocalStorageEntry[] = [
      { key: 'name', value: null },
      { key: null as any, value: 'Alice' },
      { key: 'email', value: 'bob@example.com' },
    ];

    const result = pipe.transform(data, 'name', '');
    expect(result).toEqual([
      { key: 'name', value: null },
    ]);
  });
});
