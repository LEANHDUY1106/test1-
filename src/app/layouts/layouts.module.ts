import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

import { VerticalComponent } from './vertical/vertical.component';
import { LayoutComponent } from './layout/layout.component';
import { AppBreadcrumbModule } from './shared/breadcrumb';

@NgModule({
  declarations: [VerticalComponent, LayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AppBreadcrumbModule.forRoot()
  ],
  exports: [VerticalComponent]
})
export class LayoutsModule { }
