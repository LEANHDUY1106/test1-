import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BusyDirective } from '@shared/directives/busy.directive';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PaginationComponent } from './pagination/pagination.component';
import { PMDialogComponent } from './pm-dialog/pm-dialog.component';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
@NgModule({
    declarations: [
         DataNotFoundComponent
        , BusyDirective
        , PaginationComponent
        , PMDialogComponent
        ,PagetitleComponent
        , UploadFileComponent
    ],
    imports: [
        CommonModule
        , RouterModule
        , FormsModule
        , ReactiveFormsModule
        , NgSelectModule
        , PaginatorModule
        , DropdownModule
        , DialogModule
        , ButtonModule
        ,MessagesModule
        ,MessageModule
    ],
    exports: [
         DataNotFoundComponent
        , BusyDirective
        , PaginationComponent
        , PMDialogComponent
        ,PagetitleComponent
        , UploadFileComponent
    ],
    providers: []
})
export class UiModule { }
