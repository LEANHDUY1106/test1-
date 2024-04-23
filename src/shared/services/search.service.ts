import { Injectable } from '@angular/core';
import { Search } from '@shared/models/search';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  state = new BehaviorSubject<Search>(null);
  currentState = this.state.asObservable();
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource

  constructor() { }
 
  // method này để change source message 
  changeState(state) {
    this.state.next(state);
  }
}