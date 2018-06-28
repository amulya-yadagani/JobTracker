import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.scss']
})
export class ResultTabComponent implements OnInit {
  @Output() onTabSelection = new EventEmitter();
  @Input()
  public set ontabload(onTabList) {
    this.setTabList = onTabList;
  }
  setTabList;
  constructor() { }
    
  ngOnInit() {
  }

  selectedTab(selTab) {
    this.onTabSelection.emit(selTab);
  }

}
