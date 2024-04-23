import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PageComponent {
  title = 'DX-Request-web';
  constructor(private router: Router) {
    this.router.navigateByUrl('/manage-request');
  }
}
