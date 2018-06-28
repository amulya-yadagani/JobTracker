import { Component, OnInit, Input } from '@angular/core';

@Component({
  templateUrl: './no-result-response-popup.component.html',
  styleUrls: ['./no-result-response-popup.component.scss']
})
export class NoResultResponsePopupComponent implements OnInit {
  @Input('errMsg') errMsg;
  constructor() { }
    
  ngOnInit() {

  }

}
