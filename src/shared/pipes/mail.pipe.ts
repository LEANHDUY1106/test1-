import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mail'
})
export class MailPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): unknown {
    return value?.split('@')[0];
  }

}
