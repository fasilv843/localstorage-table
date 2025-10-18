import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageEntry } from '../services/storage';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(localStorages: LocalStorageEntry[], ...args: [string, string]): LocalStorageEntry[] {
    if (localStorages.length === 0) return [];

    const [key, value] = args.map(x => x.toLowerCase().trim())

    const filteredStorage = localStorages.filter(s => {

      const keyMatch = !s.key && !key || s.key && s.key.toLowerCase().includes(key)
      const valueMatch = !s.value && !value || s.value && s.value.toLowerCase().includes(value)

      return keyMatch && valueMatch
    })

    return filteredStorage;

  }
}
