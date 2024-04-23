import { Component, ContentChildren, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import CONSTANT from '@shared/configs/CONSTANT';
import { PrimeTemplate } from 'primeng/api';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent {
    isFullScreen: boolean = false;
    @HostListener('window:resize', ['$event'])
    onResize(){
      this.isFullScreen = false;
      if(window.innerWidth >= 992){
        this.isFullScreen = true;
      }
    }

    @Input() justifyLeftClassName: string = 'justify-content-start';
    @Input() justifyRightClassName: string = 'justify-content-end';
    @Input() totalCount: number;
    @Input() currentPage: number = 1;
    @Input() isLoading: boolean = false;
    @Input() rowPerPage: number = CONSTANT.ROWS_PER_PAGE_DEFAULT;
    @Output('onPageChange') _onPageChange = new EventEmitter<any>();
    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

    // rowPerPage: number = CONSTANT.ROWS_PER_PAGE_DEFAULT;
    leftTemplate: TemplateRef<any>;
    rightTemplate: TemplateRef<any>;
    rowsPerPageOptions: Object[] = CONSTANT.ROWS_PER_PAGE_OPTIONS_DEFAULT;

    first: number = 0;
    from: number = 0;
    to: number = 0;

    constructor() {
        this.isFullScreen = false;
        if(window.innerWidth >= 992){
          this.isFullScreen = true;
        }
     }

    ngOnChanges(changes: Object) {
        this.onChangePaginatorInput(changes)
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'left':
                    this.leftTemplate = item.template;
                    break;

                case 'right':
                    this.rightTemplate = item.template;
                    break;
            }
        });
    }

    onChangePaginatorInput(changes: Object) {
        if(this.currentPage <= 1) {
            this.first = 0;
        }
        if (!this.totalCount) return;
        if (
            changes.hasOwnProperty('totalCount')
            || changes.hasOwnProperty('currentPage')
        ) {
            this.first = (this.currentPage - 1) * this.rowPerPage + 1;
            this.from = (this.currentPage - 1) * this.rowPerPage + 1;
            this.to = this.currentPage * this.rowPerPage;
            if (this.to > this.totalCount) this.to = this.totalCount;
        }

    }


    onPageChange($event){
        this.first = $event.first;
        this._onPageChange.emit($event)
    }
    onChangeRowPerPage(event){
        this._onPageChange.emit({
            rows: this.rowPerPage,
            page: 0
        })
        setTimeout(() => {

            (<HTMLElement>document.activeElement).blur()

        }, 100);
    }

}
