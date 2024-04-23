import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStateLeftMenuService {
  state = new BehaviorSubject<boolean>(true);
  currentState = this.state.asObservable();
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource

  constructor() { }

  // method này để change source message 
  changeState(state: any) {
    this.state.next(state);
  }
}