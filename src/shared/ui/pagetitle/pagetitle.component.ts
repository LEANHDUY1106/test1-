import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-pagetitle',
    templateUrl: './pagetitle.component.html'
})
export class PagetitleComponent implements OnInit {

    @Input() breadcrumbItems;
    @Input() title: string;
    @Input() styleClass: string | null;

    constructor() { }

    ngOnInit(): void {
    }

}
