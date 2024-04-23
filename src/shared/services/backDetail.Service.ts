import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackDetailService {
  state = new BehaviorSubject<number>(0);
  currentState = this.state.asObservable();
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource

  constructor() { }
 
  // method này để change source message 
  changeState(state) {
    this.state.next(state);
  }
}