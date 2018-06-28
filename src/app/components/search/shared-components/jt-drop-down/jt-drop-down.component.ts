import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jt-dropdown',
  templateUrl: './jt-drop-down.component.html',
  styleUrls: ['./jt-drop-down.component.scss']
})
export class JTDropdownComponent implements OnInit {
  dropdownList = [];
  selectedOption = '';
  @Input()
  public set setDropDownInfo(setInfo) {
    this.dropdownList = setInfo;
  }
  @Output() selectedLogic = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onSelectChange(selInfo) {
    this.selectedOption = selInfo;
  }
}
