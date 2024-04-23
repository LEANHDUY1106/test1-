import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { AppBreadcrumbService } from './app-breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs | async" let-last = last>
      <li class="breadcrumb-item"
          *ngIf="breadcrumb.label && breadcrumb.label.title && (breadcrumb.url.slice(-1) == '/' || last)"
          [ngClass]="{active: last}">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
        <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
      </li>
    </ng-template>
  `
})
export class AppBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() fixed: boolean = false;
  public breadcrumbs: any;
  private readonly fixedClass = 'breadcrumb-fixed';

  constructor(
    private renderer: Renderer2,
    public service: AppBreadcrumbService,
    public el: ElementRef
  ) { }

  public ngOnInit(): void {
    this.Replace(this.el);
    this.isFixed(this.fixed);
    this.service.breadcrumbs.subscribe(breadcrumbs => this.breadcrumbs = breadcrumbs);
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, this.fixedClass);
  }

  isFixed(fixed: boolean = this.fixed): void {
    if (fixed) {
      this.renderer.addClass(document.body, this.fixedClass);
    }
  }

  Replace(el: any): any {
    const nativeElement: HTMLElement | null = el.nativeElement; // Chỉ định kiểu dữ liệu cho nativeElement là HTMLElement | null
    if (nativeElement !== null) { // Kiểm tra nativeElement có khác null hay không
      const parentElement: HTMLElement = nativeElement.parentElement as HTMLElement; // Ép kiểu nativeElement.parentElement về HTMLElement
      // move all children out of the element
      while (nativeElement.firstChild) {
        parentElement.insertBefore(nativeElement.firstChild, nativeElement);
      }
      // remove the empty element(the host)
      parentElement.removeChild(nativeElement);
    }
  }
}  
