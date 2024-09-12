import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'integer',
  standalone: true
})
export class IntegerPipe implements PipeTransform {

  transform(value: any): number {
    return isNaN(value) ? 0 : Math.floor(Number(value));
  }

}
