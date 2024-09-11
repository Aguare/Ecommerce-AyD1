import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {


  constructor(private _localStorageService: LocalStorageService) {}

  transform(price: number): string {
    const currency = this._localStorageService.getCurrency() ? this._localStorageService.getCurrency() : '$';
    return `${currency} ${price}`;
  }

}
