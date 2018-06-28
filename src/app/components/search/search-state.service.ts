import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import {
  AppStateService,
  SEARCH_GLOBAL_DOWNLOAD_RESULT,
  SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT,
  SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT,
  SEARCH_PDF_DOWNLOAD_MSG_RESULT,
} from '../../state/app-state.service';
import { Observable } from 'rxjs/Observable';
import {
  SEARCH_GLOBAL_FILEID,
  SEARCH_GLOBAL_DOWNLOAD,
  SEARCH_GLOBAL_THUMBNAIL,
  SEARCH_GLOBAL_FILE_EXISTS
} from '../../utils/constants';
import { getErrorAction } from '../../utils/utils';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Injectable()
export class SearchStateService {
  mapAssetDetails = {
    digAssetFileId : 'Digital Asset File Id',
    fileType : 'File Type',
    magazineName : 'Magazine',
    fileName : 'File Name',
    fileExtension : 'File Extension',
    documentType : 'Document Type',
    server : 'Server',
    location : 'Location',
    fileSize : 'File Size',
    dateEntered : 'Date Entered',
    uploadedBy : 'Uploaded By',
    createdDate : 'Created Date',
    modifiedBy : 'Modified By',
    modifiedDate : 'Modified Date',
    textContent : 'Text Content',
    jobNumber: 'Job Number',
    requestNumber: 'Request Number'
  };
  constructor(
    private _http: Http,
    private _appStateService: AppStateService
  ) { }

  getAssetPropertyValue(prop) {
    return this.mapAssetDetails[prop];
  }

  getFileId(fileId, eventActionName, cardDetails) {
    // gets file search by details
    this._appStateService.showLoader(true);
    this._http.get(SEARCH_GLOBAL_FILEID + '/' + fileId)
    .map((resp) => resp.json())
    .catch(this.handleError.bind(this, 'getFileId()'))
    .subscribe((resp) => {
      this._appStateService.showLoader(false);
      if("model" in resp) {
        this._appStateService.dispatch({
          type: eventActionName,
          payload: resp,
          cardInfo: cardDetails
        })
      }
    });
  }

  downloadFileExists(fileList, eventActionName, nextEventActionName) {
    this._appStateService.showLoader(true);
    this._http.post(SEARCH_GLOBAL_FILE_EXISTS, fileList)
    .map((resp) => {
      return resp.json();
    })
    .catch(this.handleError.bind(this, 'downloadFileExists()'))
    .subscribe((fileResp) => {
      this._appStateService.showLoader(false);
      switch (eventActionName) {
        case SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT :
          this._appStateService.dispatch({
            type: SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT,
            payload: fileResp,
            fileList: fileList,
            nextAction: nextEventActionName
          });
          break;
        case SEARCH_PDF_DOWNLOAD_MSG_RESULT :
          this._appStateService.dispatch({
            type: SEARCH_PDF_DOWNLOAD_MSG_RESULT,
            payload: fileResp,
            fileList: fileList,
            nextAction: nextEventActionName
          })
      }
    });
  }

  downloadFileId(fileIds, eventActionName) {
    if (fileIds) {
      let opts = new RequestOptions();
      opts.responseType = ResponseContentType.Blob; // ResponseContentType.Blob
      this._appStateService.showLoader(true);
      const fileExt = (fileIds.length > 1) ? '.zip' : '.' + fileIds[0].value.split('.')[1];
      this._http.post(SEARCH_GLOBAL_DOWNLOAD, fileIds, opts)
      .map((resp) => {
        return resp.blob();
      })
      .catch(this.handleError.bind(this, 'downloadFileId()'))
      .subscribe((blogResp) => {
        this._appStateService.showLoader(false);
        switch(eventActionName) {
          case SEARCH_GLOBAL_DOWNLOAD_RESULT:
            this._appStateService.dispatch({
              type: SEARCH_GLOBAL_DOWNLOAD_RESULT,
              payload: blogResp,
              fileExt: fileExt,
              fileIds: fileIds
            });
            break;
        }
      });
    }
  }

  formateDate(classify, dataFormat) {
    switch (classify) {
      case 'dateEntered' :
      case 'modifiedDate' :
      case 'createdDate' :
        return (dataFormat) ? new Date(dataFormat).toLocaleDateString() : '';
      case 'fileSize' :
        return (dataFormat) ? (dataFormat/1024).toFixed(2) + ' KB': '';
    }
    return dataFormat;
  }

  handleError(fnName,err:any,caught) {
    this._appStateService.showLoader(false);
    const errAction = getErrorAction(err, fnName, "search-state.service.ts");
    this._appStateService.dispatch(errAction);
    this._appStateService.showNotification(err,null);
    return Observable.of([]);
  }
}
