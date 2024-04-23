import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AppBreadcrumbService } from './app-breadcrumb.service';

@Component({
  selector: 'cui-breadcrumb',
  templateUrl: './cui-breadcrumb.component.html'
})
export class CuiBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() fixed: boolean;

  public breadcrumbs;
  private readonly fixedClass = 'breadcrumb-fixed';

  constructor(
    private renderer: Renderer2,
    public service: AppBreadcrumbService,
  ) { }

  public ngOnInit(): void {
    this.isFixed(this.fixed);
    this.breadcrumbs = this.service.breadcrumbs;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, this.fixedClass);
  }

  isFixed(fixed: boolean = this.fixed): void {
    if (fixed) {
      this.renderer.addClass(document.body, this.fixedClass);
    }
  }
}
