import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppStateService } from '../../../state/app-state.service';
import {
  COVER_SEARCH_RESULT,
  COVER_SEARCH_THUMBNAIL_RESULT,
  COVER_SEARCH_METADATA_RESULT,
  COVER_SEARCH_METADATA,
  SEARCH_COVER_REG_THUMBNAIL_RESULT,
  COVER_SEARCH_CIRCMAN_METADATA,
  COVER_SEARCH_CIRCMAN_METADATA_RESULT
} from '../../../state/app-state.service';
import { getErrorAction } from '../../../utils/utils';
import { Observable } from 'rxjs/Observable';
import {
  COVER_SEARCH_URL,
  COVER_SEARCH_THUMBNAIL,
  COVER_SEARCH_METADATA_URL,
  SEARCH_GLOBAL_FILEID,
  SEARCH_GLOBAL_THUMBNAIL,
  COVER_SEARCH_CIRCMAN_METADATA_URL
} from '../../../utils/constants';

@Injectable()
export class CoverSearchService {
  resultActionModel = [
    { txt: 'Select All', prop: 'SELECTALL', selected: false, show: true, disable: false },
    { txt: 'Clear All', prop: 'CLEARALL', selected: false, show: true, disable: true },
    { txt: 'Download', prop: 'DOWNLOAD', selected: false, show: true, disable: true },
    { txt: 'Thumbnail', prop: 'THUMBNAIL', selected: false, show: true, disable: true },
    { txt: 'Export', prop: 'EXPORT', selected: false, show: false, disable: false }
  ];

  private buttonBarCombination = {
    enable: {
      'SELECTALL': ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT'],
      'CLEARALL': ['SELECTALL'],
      'PARTIALSELECT': ['SELECTALL', 'CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
    },
    disable: {
      'SELECTALL': ['SELECTALL'],
      'CLEARALL': ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
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
  }

  constructor(private _http: Http, private _appStateService: AppStateService) {
    _appStateService.subscribe(COVER_SEARCH_METADATA, this.getMetaData.bind(this));
    _appStateService.subscribe(COVER_SEARCH_CIRCMAN_METADATA, this.getCircmanData.bind(this));
   }

  getMetaData(action) {
    this._appStateService.showLoader(true);
    this._http.get(COVER_SEARCH_METADATA_URL)
    .map((res) => res.json())
    .catch(this.handleError.bind(this, 'getMetaData()'))
    .subscribe(result => {
      this._appStateService.showLoader(false);
      const metadata = result.model;
      this._appStateService.dispatch({
        type: COVER_SEARCH_METADATA_RESULT,
        payload: metadata
      });
    });
  }

  getCircmanData(action) {
    this._appStateService.showLoader(true);
    this._http.get(COVER_SEARCH_CIRCMAN_METADATA_URL+"?magCode="+action.code+"&circManIndicator="+action.id+"&status=true")
    .map((res) => res.json())
    .catch(this.handleError.bind(this, 'getCircmanData()'))
    .subscribe(result => {
      this._appStateService.showLoader(false);
      const metadata = result.model;
      this._appStateService.dispatch({
        type: COVER_SEARCH_CIRCMAN_METADATA_RESULT,
        payload: metadata
      });
    });
  }

  onRequestGetModel(searchParam) {
    this._appStateService.showLoader(true);
    this._http.post(COVER_SEARCH_URL, searchParam)
      .map(resp => resp.json())
      .catch(this.handleError.bind(this, 'onRequestGetModel()'))
      .subscribe((resp) => {
        this._appStateService.showLoader(false);
        this.updatePageInformation(resp.model);
        this._appStateService.dispatch({
          type: COVER_SEARCH_RESULT,
          searchParam: searchParam,
          payload: resp
        });
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

  onRequestGetThumbnail(searchFileIdList) {
    this._http.post(COVER_SEARCH_THUMBNAIL, {
      "ids": [
        19322,
        6786
      ]
    })
      .map(resp => resp.json())
      .catch(this.handleError.bind(this, 'onRequestGetThumbnail()'))
      .subscribe((resp) => {
        this._appStateService.dispatch({
          type: COVER_SEARCH_THUMBNAIL_RESULT,
          payload: resp
        });
      });
  }

  setEnableButtonBarCombination(accessType, tabType, actionType) {
    if (this.buttonBarCombination.enable[accessType]) {
      this.buttonBarCombination[actionType][accessType].forEach((eachCombs) => {
        this.resultActionModel.forEach((eachButton) => {
          if (eachButton.prop === eachCombs) {
            eachButton.disable = !(eachButton.selected = true);
          }
          if (eachButton.prop === accessType) { eachButton.disable = true; };
          if (eachButton.prop === tabType) { eachButton.disable = false; eachButton.show = true };
        });
      });
    }
  }
  setDisableButtonBarCombination(accessType, tabType, actionType) {
    if (this.buttonBarCombination.enable[accessType]) {
      this.buttonBarCombination[actionType][accessType].forEach((eachCombs) => {
        this.resultActionModel.forEach((eachButton) => {
          if (eachButton.prop === eachCombs) {
            eachButton.disable = !(eachButton.selected = false);
          }
          actionType;
          if (eachButton.prop === accessType) { eachButton.disable = true; };
          if (eachButton.prop === tabType) { eachButton.disable = false; eachButton.show = true }
        });
      });
    }
  }

  getPageInformation() {
    return this._pageDefaultInfo;
  }

  setPageInformation(pageInfo) {
    this._pageDefaultInfo = pageInfo;
  }

  reqThumbnailRegenerate(params) {
    this._http.post(SEARCH_GLOBAL_THUMBNAIL, params)
    .map((resp) => resp.json())
    .subscribe((resp) => {
      if (resp && resp.model) {
        this._appStateService.dispatch({
          type: SEARCH_COVER_REG_THUMBNAIL_RESULT,
          payload: resp.model,
          idList: params.ids
        });
      }
    });
  }

  handleError(fnName, err: any, caught) {
    this._appStateService.showLoader(false);
    const errAction = getErrorAction(err, fnName, "global-search-service.ts");
    this._appStateService.dispatch(errAction);
    this._appStateService.showNotification(err, null);
    return Observable.of([]);
  }

}
