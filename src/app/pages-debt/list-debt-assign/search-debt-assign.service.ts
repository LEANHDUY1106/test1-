import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchDebtAssignDebtService {
  state = new BehaviorSubject<RequestInvoiceDebtSearch>(null);
  currentState = this.state.asObservable();
  // có thể subcribe theo dõi thay đổi value của biến này thay cho messageSource

  constructor() { }
 
  // method này để change source message 
  changeState(state) {
    this.state.next(state);
  }
}

export interface RequestInvoiceDebtSearch {
  p_contractnumber: string
  invoicenumber: string
  p_demaccount: string
  p_status: string
  startDate?: Date
  endDate?: Date
  customername: string
  createdUser: string
  orderBy: string
  isSortDesc: boolean
  taxcode: string
  fetch: number
  offset: number
  curentPage: number
}
