import { Component, OnInit, Input } from '@angular/core';

@Component({
  templateUrl: './thumbnail-response-popup.component.html',
  styleUrls: ['./thumbnail-response-popup.component.scss']
})
export class ThumbnailResponsePopupComponent implements OnInit {
  @Input()
  public set setFileContent(setIdMessage) {
    this.idListInformation = setIdMessage;
  }
  @Input()
  public set setCustomIdTitle(setTitleMessage) {
    this.titleMessage = setTitleMessage;
  }
  idListInformation;
  titleMessage;
  constructor() { }

  ngOnInit() { }

}
