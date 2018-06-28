import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import {
  AppStateService,
  PDF_SEARCH_METADATA,
  PDF_SEARCH_METADATA_RESULT,
  PDF_SEARCH,
  PDF_SEARCH_RESULT,
  SEARCH_PDF_THUMBNAIL_DETAILS_RESULT,
  SEARCH_PDF_REG_THUMBNAIL_RESULT,
  SEARCH_PDF_REQUEST_NO
} from '../../../state/app-state.service';
import {
  PDF_SEARCH_METADATA_URL,
  PDF_SEARCH_URL,
  SEARCH_GLOBAL_THUMBNAIL,
  PDF_SEARCH_REQNO_URL
} from '../../../utils/constants';
import { getErrorAction } from '../../../utils/utils';

@Injectable()
export class PDFSearchService {
  private _buttonBar = [
    { txt: 'Select All', prop: 'SELECTALL', selected: false, show: true, disable: false },
    { txt: 'Clear All', prop: 'CLEARALL', selected: false, show: true, disable: true },
    { txt: 'Download', prop: 'DOWNLOAD', selected: false, show: true, disable: true },
    { txt: 'Thumbnail', prop: 'THUMBNAIL', selected: false, show: true, disable: true },
    { txt: 'Export', prop: 'EXPORT', selected: false, show: false, disable: false }
  ];
  private buttonBarCombination = {
    enable: {
      'SELECTALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT'],
      'CLEARALL' : ['SELECTALL'],
      'PARTIALSELECT' : ['SELECTALL', 'CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
    },
    disable: {
      'SELECTALL' : ['SELECTALL'],
      'CLEARALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
    }
  };
  private _pageDefaultInfo = {
    pageIndex: 1,
    pageSize: 25,
    totalPages: null,
    totalItems: null,
    hasPreviousPage: false,
    hasNextPage: false,
    searched: false
  };

  constructor(private _http: Http, private _appStateService:AppStateService) {
    _appStateService.subscribe(PDF_SEARCH_METADATA, this.getMetaData.bind(this));
    // stateService.subscribe(PDF_SEARCH, this.onPdfSearch.bind(this));
  }

  getMetaData(action) {
    this._appStateService.showLoader(true);
    this._http.get(PDF_SEARCH_METADATA_URL)
    .map((res) => res.json())
    .catch(this.handleError.bind(this, 'getMetaData()'))
    .subscribe(result => {
      this._appStateService.showLoader(false);
      const metadata = result.model;
      this._appStateService.dispatch({
        type: PDF_SEARCH_METADATA_RESULT,
        payload: metadata
      });
    });
  }

  reqPdfSearch(params) {
    this._appStateService.showLoader(true);
    this._http.post(PDF_SEARCH_URL + '?' + this.getURLPageInfo(), params) 
    .map(resp => resp.json())
    .catch(this.handleError.bind(this, 'reqPdfSearch()'))
    .subscribe((resp) => {
      this.updatePageInformation(resp.model);
      this._appStateService.showLoader(false);
      if (resp && resp.model) {
        const searchResultModel = resp.model;
        this._appStateService.dispatch({
          type: PDF_SEARCH_RESULT,
          payload: searchResultModel
        });
      }
    });
  }

  private updatePageInformation(pageInfo) {
    this._pageDefaultInfo.hasNextPage = pageInfo.hasNextPage;
    this._pageDefaultInfo.hasPreviousPage = pageInfo.hasPreviousPage;
    this._pageDefaultInfo.totalItems = pageInfo.totalItems;
    this._pageDefaultInfo.totalPages = pageInfo.totalPages;
    this._pageDefaultInfo.pageIndex = (this._pageDefaultInfo.pageIndex <= pageInfo.totalPages) ? pageInfo.totalPages + 1 : pageInfo.totalPages;
    this._pageDefaultInfo.searched = true;
  }

  // public retrieveRequestNumber() {
  //   this._appStateService.showLoader(true);
  //   this._http.get(PDF_SEARCH_REQNO_URL)
  //   .map((resp) => resp.json())
  //   .catch(this.handleError.bind(this, 'retrieveRequestNumber()'))
  //   .subscribe((resp) => {
  //     this._appStateService.showLoader(false);
  //     if (resp) {
  //       this._appStateService.dispatch({
  //         type: SEARCH_PDF_REQUEST_NO,
  //         payload: resp
  //       });
  //     }
  //   });
  // }

  getURLPageInfo() {
    return 'pageIndex=' + this._pageDefaultInfo.pageIndex + '&pageSize=' + this._pageDefaultInfo.pageSize;
  }

  getButtonBar() {
    return this._buttonBar;
  }

  setEnableButtonBarCombination(accessType, tabType, actionType) {
    if (this.buttonBarCombination[actionType][accessType]) {
      this.buttonBarCombination[actionType][accessType].forEach((eachCombs) => {
        this._buttonBar.forEach((eachButton) => {
          if (eachButton.prop === eachCombs) {
            eachButton.disable = (eachButton.selected = false);
          }
          if (eachButton.prop === accessType) {
            eachButton.disable = (eachButton.selected = true);
          };
        });
      });
    }
  }
  setDisableButtonBarCombination(accessType, tabType, actionType) {
    if (this.buttonBarCombination[actionType][accessType]) {
      this.buttonBarCombination[actionType][accessType].forEach((eachCombs) => {
        this._buttonBar.forEach((eachButton) => {
          if (eachButton.prop === eachCombs) {
            eachButton.disable = (eachButton.selected = true);
          }
          if (eachButton.prop === accessType) {
            eachButton.disable = (eachButton.selected = true);
          };
        });
      });
    }
  }

  reqThumbnailRegenerate(params) {
    this._http.post(SEARCH_GLOBAL_THUMBNAIL, params)
    .map((resp) => resp.json())
    .subscribe((resp) => {
      if (resp && resp.model) {
        this._appStateService.dispatch({
          type: SEARCH_PDF_REG_THUMBNAIL_RESULT,
          payload: resp.model,
          idList: params.ids
        });
      }
    });
  }

  getPageInformation() {
    return this._pageDefaultInfo;
  }

  setPageInformation(pageInfo) {
    this._pageDefaultInfo = pageInfo;
  }

  handleError(fnName, err: any, caught): any {
    const errAction = getErrorAction(err, fnName, "pdf-final-search.service.ts");
    this._appStateService.dispatch(errAction);
    this._appStateService.showLoader(false);

    this._appStateService.showNotification(err,null);
    //Return observable that emits empty array. This will call fn passed to subscribe() with value as []
    return Observable.of([]);
  }
}
