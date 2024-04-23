import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
// import { LanguageService } from '../../core/services/language.service';
// import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    HeaderComponent
    , FooterComponent
    , SidebarComponent
  ],
  imports: [
    CommonModule,
    // TranslateModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule
  ],
  exports: [
    HeaderComponent
    , FooterComponent
    , SidebarComponent
  ],
  providers: [

  ]
})
export class SharedModule { }
