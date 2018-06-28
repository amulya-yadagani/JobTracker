import { Component, OnInit, Input } from '@angular/core';
import {
  SEARCH_GLOBAL_DOWNLOAD_RESULT
} from '../../../../state/app-state.service';
import { SearchStateService } from '../../search-state.service';

@Component({
  templateUrl: './download-response-popup.component.html',
  styleUrls: ['./download-response-popup.component.scss']
})
export class DownloadResponsePopUpComponent implements OnInit {
  @Input() set titleInfo(title) {
    this.title = title;
  };
  @Input() set rejInformation(rejInfo) {
    this.rejInfo = rejInfo;
  };
  @Input() set dialogBox(dialogRef) {
    this.dialogRef = dialogRef;
  };
  @Input() set downloadFileList(downloadFiles) {
    this.downloadFiles = downloadFiles;
  };
  @Input() set nextActionEvent(eventAction) {
    this.eventAction = eventAction;
  }
  @Input() set disableButtonAction(disableDownloadBtn: boolean) {
    this.disableDownloadBtn = disableDownloadBtn; 
  }
  downloadFiles;
  disableDownloadBtn: boolean = false;
  eventAction;
  title: string;
  rejInfo: string;
  dialogRef;
  constructor(
    private _searchStateService: SearchStateService
  ) { }

  ngOnInit() { }

  okayTriggered() {
    this.dialogRef.close();
    this._searchStateService.downloadFileId({ids:this.downloadFiles}, this.eventAction);
  }

  cancelTriggered() {
    this.dialogRef.close();
  }
}
