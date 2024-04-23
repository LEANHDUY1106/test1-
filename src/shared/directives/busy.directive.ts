import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[busy]'
})
export class BusyDirective {

    constructor(private _element: ElementRef) { }

    @Input() set busy(isBusy: boolean) {
        this.refreshState(isBusy);
      }

      refreshState(isBusy: boolean): void {
        if (isBusy === undefined) {
          return;
        }

        if (isBusy) {
          myApp.ui.setBusy(this._element.nativeElement);
        } else {
          myApp.ui.clearBusy(this._element.nativeElement);
        }
      }
}
