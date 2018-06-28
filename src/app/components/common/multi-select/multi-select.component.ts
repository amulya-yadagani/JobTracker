import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'multi-select',
  templateUrl: 'multi-select.component.html'
})

export class MultiSelectComponent implements OnInit {
  @Output() valueSelected = new EventEmitter();
  @Input()
  dataSource = [];
  @Input()
  textField = "value";
  @Input()
  valueField = "key";
  selectedValues = [];
  @Input() dropType; // ensures which dropdown it points, when component used as reuse... 
  @Input() set clearSelValues(clearSelValues: boolean) {
    if (clearSelValues) {
      this.selectedValues = [];
    }
  };
  constructor() { }

  ngOnInit() { }

  valueChange(valChange) {
    this.valueSelected.emit({type: this.dropType, selVal: valChange});
  }

}
