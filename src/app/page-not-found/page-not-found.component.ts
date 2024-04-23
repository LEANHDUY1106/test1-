import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
    private readonly canGoBack: boolean;
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        this.canGoBack = !!(this.router.getCurrentNavigation()?.previousNavigation);
    }
    goBack(): void {
        if (this.canGoBack) {
            this.location.back();
        } else {
            this.router.navigate(['..'], { relativeTo: this.route });
        }
    }

}
