import { Component, OnInit, AfterViewInit, Input, Injector, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateRequestComponent } from '../create-request-manage/create-request.component';
@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html'
})

export class EditRequestComponent implements OnInit {
  @ViewChild(CreateRequestComponent) createCourseLibrary: CreateRequestComponent;
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.createCourseLibrary.canDeactivate();
  }

  postid: number;
  constructor(private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = '';
      id = params['id'];

      if (id != '') {
        this.postid = +id;
      }
    });
  }

}
