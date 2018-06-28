import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jt-input',
  templateUrl: './jt-input.component.html',
  styleUrls: ['./jt-input.component.scss']
})
export class JtInputComponent implements OnInit {
  @Input() dynamicId;
  @Input()
  public set dynamicTxt(dynamicTxt) {
    this.dynamicText = dynamicTxt;
  }
  //global
  @Output() searchFile1 = new EventEmitter();
  @Output() searchFile2 = new EventEmitter();
  @Output() searchFile3 = new EventEmitter();
  //pdf
  @Output() searchedUploaded = new EventEmitter();
  @Output() searchedFileName = new EventEmitter();
  @Output() SearchedModifiedBy = new EventEmitter();
  @Output() searchedJobNo = new EventEmitter();
  @Output() searchedKeyword = new EventEmitter();

  dynamicText: string;
  inputContent: string = <string> '';
  constructor() { }

  ngOnInit() {
  }

  contentChanged() {
    if (this.inputContent !== '' && this.inputContent.length > 0) {
      switch (this.dynamicId) {
        // global search section
        case 'file1':
          this.searchFile1.emit({type: this.dynamicId, info: this.inputContent});
          break;
        case 'file2':
          this.searchFile2.emit({type: this.dynamicId, info: this.inputContent});
          break;
        case 'file3':
          this.searchFile3.emit({type: this.dynamicId, info: this.inputContent});
          break;
        // pdf search section
        case 'UploadedBy':
          this.searchedUploaded.emit(this.inputContent);
          break;
        case 'FileName' :
          this.searchedFileName.emit(this.inputContent);
          break;
        case 'ModifiedBy' :
          this.SearchedModifiedBy.emit(this.inputContent);
          break;
        case 'JobNumber' :
          this.searchedJobNo.emit(this.inputContent);
          break;
        case 'KeyWord' :
          this.searchedKeyword.emit(this.inputContent);
          break;
      }
    }
  }
}
