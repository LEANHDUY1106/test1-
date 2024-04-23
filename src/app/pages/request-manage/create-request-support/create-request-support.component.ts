import { Component, OnInit, AfterViewInit, Input, Injector, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateRequestComponent } from '../create-request-manage/create-request.component';
@Component({
  templateUrl: './create-request-support.component.html'
})

export class CreateRequestSupportComponent implements OnInit {
  @ViewChild(CreateRequestComponent) createCourseLibrary: CreateRequestComponent;
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.createCourseLibrary.canDeactivate();
  }

  postid: number;
  constructor(private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
  }

}
