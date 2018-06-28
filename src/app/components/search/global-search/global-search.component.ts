import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  AppStateService,
  SEARCH_GLOBAL_DOWNLOAD_RESULT,
  SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT,
  SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT,
  SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT,
  SEARCH_GLOBAL_RESULT,
  SEARCH_GLOBAL_THUMBNAIL_RESULT
} from '../../../state/app-state.service';
import { ThumbnailResponsePopupComponent } from '../shared-components/thumbnail-response-popup/thumbnail-response-popup.component';
import { NoResultResponsePopupComponent } from '../shared-components/no-result-response-popup/no-result-response-popup.component';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { GlobalSearchService } from './global-search.service';
import { SearchStateService } from '../search-state.service';
import { DownloadResponsePopUpComponent } from '../shared-components/download-response-popup/download-response-popup.component';

let $;
@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('globalThumbnail') globalThumbnail;
  @ViewChild('globalList') globalList;
  file1 = { txt: 'FileName 1', prop: 'file1', eventName: 'searchFile1', fieldData: '' };
  file2 = { txt: 'FileName 2', prop: 'file2', eventName: 'searchFile2', fieldData: '' };
  file3 = { txt: 'FileName 3', prop: 'file3', eventName: 'searchFile3', fieldData: '' };
  selectedLogic = 'OR';
  searchParam = null;
  defaultPageSize = 25;
  resultThumbnailActionList = this._globalSearchService.getResultActionModel('thumbnail');
  resultListActionList = this._globalSearchService.getResultActionModel('list');
  thumbnailModel;
  gridModel;
  storeSearchPageInformation = {
    searchInfo: {}
    // searchInfo: {
      // termName: searchParam.searchParameter,
      // logic: searchParam.isAnd,
      // pageSize: searchParam.pageSize,
      // searched: false
    // },
  };
  showResultSection = false;
  searchResult: {itemSource: Array<any>};
  // resultDisplay = { thumbnail: true, list: false };
  configTabList = [
    {selected: true, tabName: 'Thumbnails', prop: 'thumbnail'},
    {selected: false, tabName: 'List', prop: 'list'}
  ];
  constructor(
    private _appStateService: AppStateService,
    private _dialogService: DialogService,
    private _globalSearchService: GlobalSearchService,
    private _searchStateService: SearchStateService
  ) {
    $ = window['jQuery'];
    this._appStateService.subscribe(SEARCH_GLOBAL_RESULT, this.onSearchedResult.bind(this));
    this._appStateService.subscribe(SEARCH_GLOBAL_THUMBNAIL_RESULT, this.onUpdatedThumbnail.bind(this));
    this._appStateService.subscribe(SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT, this.onReqDownloadFileMessage.bind(this));
    this._appStateService.subscribe(SEARCH_GLOBAL_DOWNLOAD_RESULT, this.onReqDownloadFile.bind(this)); 
  }

  ngOnInit() { }

  setLogic(selLogic) { this.selectedLogic = selLogic; }

  onClear(onClear) {
    this.displayBothTabs(false);
    this.resetFields();
  }
  resetFields() {
    this.file1.fieldData = '';
    this.file2.fieldData = '';
    this.file3.fieldData = '';
  }

  onSearch(onSearch) {
    const file1 = this.file1.fieldData;
    const file2 = this.file2.fieldData;
    const file3 = this.file3.fieldData;
    if ((this.fieldValidate(file1) || this.fieldValidate(file2) || this.fieldValidate(file3)) && this.selectedLogic) {
      const searchFiles = [file1, file2, file3].filter((eachFile) => {
        return (eachFile !== '');
      }).join(',');
      this.searchParam = {
        searchParameter : searchFiles,
        isAnd: (this.selectedLogic === 'OR') ? false : true,
        pageIndex: 1,
        pageSize: this.defaultPageSize
      };
      this.onReqDisplaySearchResult(this.searchParam);
    }
  }

  fieldValidate(fileName) {
    if (fileName === '') {
      return false;
    } else {
      const regExp = new RegExp(/^[A-Za-z0-9]+$/);
      return (regExp.test(fileName)) ? fileName : false;
    }
  }

  onReqDisplaySearchResult(searchParam) {
    // handles search related search results of thumbnail or grid...
    this._appStateService.showLoader(true);
    this._globalSearchService.onRequestGetModel(searchParam);
  }

  onSearchedResult(actions) {
    if (actions) {
      const response = actions.payload.model;
      const searchParam = actions.searchParam;
      (response.itemSource.length > 0) ? this.displayBothTabs(true) : this.noResultFound();
      this.searchResult = response;
      this.updateResultModel(this.searchResult);
      this._globalSearchService.setResultActionModel('thumbnail');
      this.resultThumbnailActionList = this._globalSearchService.getResultActionModel('thumbnail');
      this._globalSearchService.setResultActionModel('list');
      this._globalSearchService.setExportActionEnableDisable(!this.validateExportEnable(response.itemSource));
      this.resultListActionList = this._globalSearchService.getResultActionModel('list');
      this._globalSearchService.setResultModel(response);
      this.setSearchedInformation(searchParam, response);
    }
  }

  private noResultFound() {
    this.displayBothTabs(false);
    const dialogComp: DialogRef = this.noResultPopUp();
    const dialogRef = dialogComp.content.instance;
    dialogRef.errMsg = 'No results were found!';
  }

  noResultPopUp() {
    const dialogComp:DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: NoResultResponsePopupComponent,
      actions: [{text: 'Okay'}]
    });
    return dialogComp;
  }

  onReqUpdateDisplayThumbnail(searchFileIdList) {
    // handles search related generate thumbnail of selected files idlist
    this._appStateService.showLoader(true);
    this._globalSearchService.onRequestGetThumbnail({ ids: searchFileIdList});
  }
  onUpdatedThumbnail(actions) {
    this._appStateService.showLoader(false);
    const searchResultModel = this.searchResult;
    const fileTitleContent = 'File Missing';
    const response = actions.payload.model;
    const missingFileList = response.filter((eachResp) => {
      return (eachResp.isFileMissing);
    });
    const modifiedResponse = this.modifyThumbnailDisplay(missingFileList, searchResultModel); 
    const fileIdContent =  modifiedResponse.fileId;
    const modifiedResultModel = modifiedResponse.modifiedResultModel;
    if (fileIdContent.length > 0) {
      this.onDisplayDialogBox(fileTitleContent, fileIdContent);
    }
    // case 1 checked selected files if the ids matches 
    // TODO validate file missing and if not missing just replace thumbnail...
    this.searchResult = modifiedResultModel;
    this._globalSearchService.setResultModel(modifiedResultModel);
  }

  onReqDownloadSelectedFile(searchFileIdList) {
    if (searchFileIdList && searchFileIdList.length > 0) {
      const downloadFileInfo = [];
      searchFileIdList.forEach((eachSelFileId) => {
        downloadFileInfo.push({key: eachSelFileId.digAssetFileId, value: eachSelFileId.filePath});
      });
      this._searchStateService.downloadFileExists(downloadFileInfo, SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT, SEARCH_GLOBAL_DOWNLOAD_RESULT);
    }
  }

  onReqDownloadFileMessage(action) {
    const nextActionEvent = action.nextAction;
    const emptyFiles = action.payload.model;
    let disableProcedBtn = false;
    const fileUnavaliableDownload = [];
    if (emptyFiles === '') {
      // Directly send files to download...
      this._searchStateService.downloadFileId(action.fileList, nextActionEvent);
    } else {
      // first remove unnessary files from action
      // case 1 action ids are different from selected ids
      // case 2 action ids are same from selected ids
      // case 3 action ids partial same from selected ids
      const filesReqForDownload = action.fileList;
      const filesNotFoundList = action.payload.model.split(',');
      const cachedFileInfo = (this._globalSearchService.getResultModel() as any).itemSource;
      const uniqueFileList = filesNotFoundList.filter((eachFileNReq) => {
        const uniquefileFound = filesReqForDownload.some((eachFileReq) => {
          return (eachFileReq.key == eachFileNReq);
        });
        return !uniquefileFound;
      }); // gets unique files...
      const selectedFileInfo = uniqueFileList.map((eachUniqueFile) => {
        const fileInfoFound = cachedFileInfo.some((eachCachedFile) => {
          return (eachUniqueFile == eachCachedFile.digAssetFileId);
        });
        return fileInfoFound;
      }); // collects detailed information about files...
      let title: string;
      filesNotFoundList.forEach((eachFiles) => {
        const cachedFile = cachedFileInfo.filter((eachCacheFile) => {
          return (eachCacheFile.digAssetFileId == eachFiles);
        });
        fileUnavaliableDownload.push(cachedFile[0]);
      });
      title = 'Following file(s) not avaliable to download';
      if (uniqueFileList.length === 0) {
        disableProcedBtn = true;
      } else if (uniqueFileList.length < filesReqForDownload.length) {
        disableProcedBtn = false;
      }
      const dialogComp = this.onDownloadDialogContinue();
      const dialogRef = dialogComp.content.instance;
      dialogRef.titleInfo = title;
      dialogRef.dialogBox = dialogComp;
      dialogRef.downloadFileList = action.fileIds;
      dialogRef.nextActionEvent = nextActionEvent;
      dialogRef.rejInformation = fileUnavaliableDownload;
      dialogRef.disableButtonAction = disableProcedBtn;
    }
  }

  onDownloadDialogContinue() {
    const dialogRef: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: DownloadResponsePopUpComponent
    });
    return dialogRef;
  }

  onReqDownloadFile(actions) {
    if (actions && actions.payload) {
      const fileExt = actions.fileExt;
      const fileIds = actions.fileIds;
      let fileTitle = 'Global-Search(' + fileIds.length +')';
      if (fileIds.length === 1) {
        fileTitle = (this._globalSearchService.getResultModel() as any).itemSource.filter((eachFile) => {
          if (actions.fileIds[0].key == eachFile.digAssetFileId) {
            return true;
          }
        })[0].fileName + '_Global-Search';
      }
      let link = document.createElement('a');
      let url = window.URL.createObjectURL(actions.payload);
      link.setAttribute("href", url);
      link.setAttribute("download", fileTitle + fileExt);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }

  modifyThumbnailDisplay(searchResultList, searchResultModel) {
    // replace updated thumbnail based on dynamic result...
    let fileIdContent = [];
    searchResultList.forEach((eachGeneratedFiles) => {
      (searchResultModel as any).itemSource = (searchResultModel as any).itemSource.map((eachResultList) => {
        if (eachResultList.digAssetFileId === eachGeneratedFiles.digAssetFileId) {
          fileIdContent.push(eachResultList.fileName);
          //if (!eachResultList.thumbnail && eachGeneratedFiles.thumbnail) {
          // Now replaces thumbnails if not present...
          eachResultList.thumbnail = eachGeneratedFiles.thumbnail;
          //}
          if (eachGeneratedFiles.isFileMissing) {
            eachResultList['isFileMissing'] = eachGeneratedFiles.isFileMissing;
          }
        }
        return eachResultList;
      });
    });
    return { fileId: fileIdContent, modifiedResultModel: searchResultModel};
  }

  setSearchedInformation(searchParam, resultModel) {
    this.storeSearchPageInformation['searchInfo'] = {};
    this.storeSearchPageInformation['searchInfo']['termName'] = searchParam.searchParameter;
    this.storeSearchPageInformation['searchInfo']['logic'] = searchParam.isAnd;
    this.storeSearchPageInformation['searchInfo']['pageSize'] = searchParam.pageSize;
    this.storeSearchPageInformation['searchInfo']['searched'] = true;
  }

  onDisplayDialogBox(title, InformationIds) {
    const dialogRef: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: ThumbnailResponsePopupComponent,
      actions: [{text: 'Okay'}]
    });
    const thumbnailMsg = dialogRef.content.instance;
    thumbnailMsg.setFileContent = InformationIds;
    thumbnailMsg.setCustomIdTitle = title;
  }

  displayBothTabs(boolVal: boolean) {
    this.showResultSection = boolVal;
  }

  onTabSelection(selTab) {
    this.onGetSetTab('SET', this.configTabList, selTab);
  }

  onGetSetTab(classify, tabList = [], selTab?) {
    switch (classify) {
      case 'SET':
        tabList.forEach((eachTab) => {
          eachTab.selected = (eachTab.prop === selTab.prop) ? true : false;
        });
        return tabList;
      case 'GET':
        const tab = tabList.find((eachTab) => {
          return eachTab.selected;
        });
        return tab;
    }
  }

  onPageChangeAction(onPageChange) {
    this.searchParam.pageIndex = onPageChange;
    this.onReqDisplaySearchResult(this.searchParam);
  }

  onPageSizeChangeAction(onPageSizeChanges) {
    this.defaultPageSize = onPageSizeChanges;
    this.searchParam.pageSize = onPageSizeChanges;
    this.searchParam.pageIndex = 1;
    this.onReqDisplaySearchResult(this.searchParam);
  }

  getSelectedItem() {
    // TODO need verification required or not...
    return this.searchResult.itemSource.filter((eachResult) => {
      return (eachResult.selected) ? true : false;
    });
  }

  triggerActionOnResultAction(triggeredAction) {
    // this event is called on actions performed like select all, clear all, etc...
    this._globalSearchService.setEnableCombination(triggeredAction.selAction, 'enable');
    this._globalSearchService.setDisableCombination(triggeredAction.selAction, 'disable');
    this.searchResult = <any>this._globalSearchService.getResultModel();
    const noFileSelected = this.validateFilesSelected(this.searchResult);
    this.validateEnableDisableDownload(noFileSelected);
    this._globalSearchService.setExportActionEnableDisable(!this.validateExportEnable(this.searchResult.itemSource));
    this.resultThumbnailActionList = JSON.parse(JSON.stringify(this._globalSearchService.getResultActionModel('thumbnail')));
    this.resultListActionList = JSON.parse(JSON.stringify(this._globalSearchService.getResultActionModel('list')));
    this.updateResultModel(this.searchResult);
  }

  onResultActionChanges(onResultActionChanges) {
    let selFileList;
    let selFileIdList;
    switch (onResultActionChanges.selAction) {
      case 'SELECTALL' :
        this._globalSearchService.setSelectAllResult(true);
        this.triggerActionOnResultAction(onResultActionChanges);
        this.searchResult = <any>this._globalSearchService.getResultModel();
        this.updateResultModel(this.searchResult);
        break;
      case 'CLEARALL' :
        this._globalSearchService.setSelectAllResult(false);
        this.triggerActionOnResultAction(onResultActionChanges);
        this.searchResult = <any>this._globalSearchService.getResultModel();
        this.updateResultModel(this.searchResult);
        break;
      case 'THUMBNAIL' :
        //TODO find out selected thumbnails or grid
        selFileList = this._globalSearchService.reqThumbNailImageUpdate();
        selFileIdList = selFileList.map((eachSelFileId) => {
          return eachSelFileId.digAssetFileId;
        });
        this.onReqUpdateDisplayThumbnail(selFileIdList);
        break;
      case 'DOWNLOAD' :
        // TODO get all selected files and its Id and call api download functionality...
        selFileList = this._globalSearchService.reqThumbNailImageUpdate();
        this.onReqDownloadSelectedFile(selFileList);
        break;
      case 'EXPORT' :
        // Any global export operation required handled here... example export issue pop up, etc..
        break;
    }
  }

  private updateResultModel(resultModel) {
    this.gridModel = JSON.parse(JSON.stringify(resultModel));
    this.thumbnailModel = JSON.parse(JSON.stringify(resultModel));
  }

  onThumbChangeAction(onThumbNailChanges) {
    this.triggerActionOnResultAction(onThumbNailChanges);
  }
  onGridChangeAction(onGridListChanges) {
    this.triggerActionOnResultAction(onGridListChanges);
  }

  onDownloadAction(onFileSelected) {
    this.onReqDownloadSelectedFile(onFileSelected);
  }

  validateFilesSelected(searchResult) {
    // gets file counts which are selected...
    let fileSelected = 0;
    if (searchResult) {
      searchResult.itemSource.forEach((eachItem) => {
        if (eachItem.selected) {
          fileSelected++;
        }
      });
    }
    return fileSelected;
  }

  validateExportEnable(resultList) {
    return (resultList && resultList.length > 0) ? true : false;
  }

  validateEnableDisableDownload(noFileSelected) {
    // file download disabled on no file selected or more than 10 file selected...
    (noFileSelected > 10 || noFileSelected <= 0) ? 
    this._globalSearchService.setDownloadActionEnableDisable(true) :
    this._globalSearchService.setDownloadActionEnableDisable(false);
  }
}
