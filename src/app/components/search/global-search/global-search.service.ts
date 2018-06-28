import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppStateService } from '../../../state/app-state.service';
import {
  SEARCH_GLOBAL_RESULT,
  SEARCH_GLOBAL_THUMBNAIL_RESULT
} from '../../../state/app-state.service';
import { getErrorAction } from '../../../utils/utils';
import { Observable } from 'rxjs/Observable';
import {
  SEARCH_GLOBAL_URL,
  SEARCH_GLOBAL_THUMBNAIL,
  SEARCH_GLOBAL_FILEID } from '../../../utils/constants';

@Injectable()
export class GlobalSearchService {
  resultModel = {};
  resultActionModel = [
    { txt: 'Select All', prop: 'SELECTALL', selected: false, show: true, disable: false },
    { txt: 'Clear All', prop: 'CLEARALL', selected: false, show: true, disable: true },
    { txt: 'Download', prop: 'DOWNLOAD', selected: false, show: true, disable: true },
    { txt: 'Thumbnail', prop: 'THUMBNAIL', selected: false, show: true, disable: true },
    { txt: 'Export', prop: 'EXPORT', selected: false, show: false, disable: false }
  ];
  private actionCombination = {
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
  private thumbnailAction;
  private gridAction;
  constructor(
    private _http: Http,
    private _appStateService: AppStateService
  ) { }

  onRequestGetModel(searchParam) {
    this._http.post(SEARCH_GLOBAL_URL, searchParam)
    .map(resp => resp.json())
    .catch(this.handleError.bind(this, 'onRequestGetModel()'))
    .subscribe((resp) => {
      this._appStateService.showLoader(false);
      this._appStateService.dispatch({
        type: SEARCH_GLOBAL_RESULT,
        searchParam: searchParam,
        payload: resp
      });
    });
  }

  onRequestGetThumbnail(searchFileIdList) {
    this._http.post(SEARCH_GLOBAL_THUMBNAIL, searchFileIdList)
    .map(resp => resp.json())
    .catch(this.handleError.bind(this, 'onRequestGetThumbnail()'))
    .subscribe((resp) => {
      this._appStateService.dispatch({
        type: SEARCH_GLOBAL_THUMBNAIL_RESULT,
        payload: resp
      });
    });
  }

  setResultModel(resultModelList) {
    this.resultModel = resultModelList;
  }

  getSelectedResultModel() {
    // gets selected results...
    return (this.resultModel as any).itemSource.map((eachResult) => {
      return (eachResult.selected) ? true : false;
    })
  }

  getResultModel() {
    return this.resultModel;
  }

  patchResultModel(resultModel, resultIndex) {
    // sets result thumbnails or cards selected files....
    (this.resultModel as any).itemSource.forEach((eachModel) => {
      if (eachModel.digAssetFileId === resultIndex) {
        eachModel.selected = resultModel.selected;
        // TODO updated info using broadcase
      }
    });
  }

  getResultActionModel(classifyType) {
    switch (classifyType) {
      case 'thumbnail' :
        return this.thumbnailAction;
      case 'list':
        return this.gridAction;
    }
  }

  setResultActionModel(classifyType) {
    let resultModel;
    switch (classifyType) {
      case 'thumbnail' :
      resultModel = JSON.parse(JSON.stringify(this.resultActionModel));
      this.thumbnailAction = resultModel.map((eachModel) => {
        eachModel.disable = (eachModel.prop === 'SELECTALL') ? false : true;
        if (eachModel.prop === 'EXPORT') {
          eachModel.show = false;
        } 
        return eachModel;
      });
      case 'list' :
      resultModel = JSON.parse(JSON.stringify(this.resultActionModel));
      this.gridAction = resultModel.map((eachModel) => {
        eachModel.disable = (eachModel.prop === 'SELECTALL') ? false : true;
        if (eachModel.prop === 'EXPORT') {
          eachModel.show = true;
          eachModel.disable = false;
        } 
        return eachModel;
      });
    }  
  }

  setEnableCombination(accessType, actionType) {
    this.gridAction.forEach((eachAction) => {
      const actionMatch = this.actionCombination.enable[accessType].some((actionComb) => {
        return (actionComb === eachAction.prop);
      });
      if (actionMatch) { eachAction.disable = eachAction.selected = false; }
      return eachAction;
    });
    this.thumbnailAction.forEach((eachAction) => {
      const actionMatch = this.actionCombination.enable[accessType].some((actionComb) => {
        return (actionComb === eachAction.prop);
      });
      if (actionMatch) { eachAction.disable = eachAction.selected = false; }
      return eachAction;
    });
  }

  setDisableCombination(accessType, actionType) {
    this.gridAction.forEach((eachAction) => {
      if (this.actionCombination.disable[accessType]) {
        const actionMatch = this.actionCombination.disable[accessType].some((actionComb) => {
          return (actionComb === eachAction.prop);
        });
        if (actionMatch) { eachAction.disable = eachAction.selected = true; }
      }
      return eachAction;
    });
    this.thumbnailAction.forEach((eachAction) => {
      if (this.actionCombination.disable[accessType]) {
        const actionMatch = this.actionCombination.disable[accessType].some((actionComb) => {
          return (actionComb === eachAction.prop);
        });
        if (actionMatch) { eachAction.disable = eachAction.selected = true; }
      }
      return eachAction;
    });
  }

  setSelectAllResult(boolVal: boolean) {
    (this.resultModel as any).itemSource = (this.resultModel as any).itemSource.map((eachResult) => {
      eachResult.selected = boolVal;
      return eachResult;
    });
  }

  reqThumbNailImageUpdate() {
    const selFileIdList = (this.resultModel as any).itemSource.filter((eachFileId) => {
      if (eachFileId.selected) {
        return true;
      }
    });
    return selFileIdList;
  }

  setDownloadActionEnableDisable(setState: boolean) {
    this.gridAction.forEach((eachResultAction) => {
      if (eachResultAction.prop === 'DOWNLOAD') {
        eachResultAction.disable = setState;
      }
    });
    this.thumbnailAction.forEach((eachResultAction) => {
      if (eachResultAction.prop === 'DOWNLOAD') {
        eachResultAction.disable = setState;
      }
    });
  }

  setExportActionEnableDisable(setState: boolean) {
    this.gridAction.forEach((eachResultAction) => {
      if (eachResultAction.prop === 'EXPORT') {
        eachResultAction.disable = setState;
      }
    })
  }

  handleError(fnName,err:any,caught) {
    this._appStateService.showLoader(false);
    const errAction = getErrorAction(err, fnName, "global-search-service.ts");
    this._appStateService.dispatch(errAction);
    this._appStateService.showNotification(err,null);
    return Observable.of([]);
  }

}
