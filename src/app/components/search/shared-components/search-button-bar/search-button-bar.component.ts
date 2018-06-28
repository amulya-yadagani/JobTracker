import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-search-button-bar',
  templateUrl: './search-button-bar.component.html',
  styleUrls: ['./search-button-bar.component.scss']
})
export class SearchButtonBarComponent implements OnInit, OnChanges {
  title: string;
  @Output() searched = new EventEmitter();
  @Output() cleared = new EventEmitter();
  @Input()
  public set setTitle(title) { this.title = title; }
  @Input() disableSearch;
  @Input() searchNotRequired;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'disableSearch') {
        let chng = changes['disableSearch'];
        this.disableSearch = chng.currentValue;
      }
    }
  }

  ngOnInit() {

  }

  triggerSearchResult() {
    this.searched.emit('search');
  }

  triggerClear() {
    this.cleared.emit('clear');
  }
}
