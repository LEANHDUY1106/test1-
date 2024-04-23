import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-page-access-denied',
    templateUrl: './page-access-denied.component.html',
    styleUrls: ['./page-access-denied.component.scss']
})
export class PageAccessDeniedComponent {
    private readonly canGoBack: boolean;
    isShowButton = false;
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        this.route.queryParams.subscribe(params=>{
            this.isShowButton = params['type'] == 0 ? false : true;
        })
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
