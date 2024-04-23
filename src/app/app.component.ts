import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'DX-Request-web';
  ngOnInit(){
    document.getElementById('waitting-init-app')?.remove();
  }
  constructor(private _mes: MessageService){
  }
  callToast(){
      this._mes.add({severity:'success',  detail:'Via MessageService'});
  }
}
