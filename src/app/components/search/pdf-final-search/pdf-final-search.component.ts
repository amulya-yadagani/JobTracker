import { Component, OnInit } from '@angular/core';
import {
  AppStateService,
  PDF_SEARCH_METADATA_RESULT,
  PDF_SEARCH_METADATA,
  PDF_SEARCH_RESULT,
  SEARCH_PDF_THUMBNAIL_DETAILS_RESULT,
  SEARCH_PDF_GRID_DETAILS_RESULT,
  SEARCH_PDF_REG_THUMBNAIL_RESULT,
  SEARCH_PDF_DOWNLOAD_MSG_RESULT,
  SEARCH_PDF_DOWNLOAD_RESULT,
  SEARCH_PDF_REQUEST_NO
} from '../../../state/app-state.service';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { SearchStateService } from '../search-state.service';
import { PDFSearchService } from './pdf-final-search.service';
import { ThumbnailResponsePopupComponent } from '../shared-components/thumbnail-response-popup/thumbnail-response-popup.component';
import { DownloadResponsePopUpComponent } from '../shared-components/download-response-popup/download-response-popup.component';
// import { RequestNumberPopUpComponent } from './requestnumber/requestnumber.component';
import { NoResultResponsePopupComponent } from '../shared-components/no-result-response-popup/no-result-response-popup.component';

@Component({
  selector: 'app-pdf-final-search',
  templateUrl: './pdf-final-search.component.html',
  styleUrls: ['./pdf-final-search.component.scss']
})
export class PdfFinalSearchComponent implements OnInit {
  //Made the member public as it is accessed in template
  searchResultModel = {};
  isExporTriggered: boolean;
  detailEventsThumbnail = SEARCH_PDF_THUMBNAIL_DETAILS_RESULT || '';
  detailEventsGrid = SEARCH_PDF_GRID_DETAILS_RESULT || '';
  buttonBar = this._pdfFinalSearch.getButtonBar();
  type: string = 'thumbnail';
  searched: boolean = false;
  thumbnailModel;
  gridModel;
  clearField = { value : 0 };
  /**
   * Holds dropdown values for select fields
   */
  metadata: any = {};
  columnConfig = [
    {
        field: 'fileName', title: 'File Name',
        template: (item) => {
          return `<div>
            <a class="fileHyperLink" style='color: steelblue;' href='javascript:void(0)'>
              ${item.fileName}
            </a>
          </div>`;
        },
        width: 100,
        filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'jobNumber', title: 'Job Number',
      template: (item) => {
          return `<div>${item.jobNumber}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'requestNumber', title: 'Request Number',
      template: (item) => {
          return `<div>${item.requestNumber}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'magazineName', title: 'Magazine',
      template: (item) => {
          return `<div>${item.magazineName}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'componentType', title: 'Component Type',
      template: (item) => {
          return `<div>${item.componentType}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'title', title: 'Job Title',
      template: (item) => {
          return `<div>${item.title}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'requestCodeName', title: 'Job Request',
      template: (item) => {
          return `<div>${item.requestCodeName}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'sourceName', title: 'Source',
      template: (item) => {
          return `<div>${item.sourceName}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'createdDate', title: 'Created Date',
      template: (item) => {
          return `<div>${new Date(item.createdDate).toLocaleDateString()}</div>`;
      },
      format: '{0:yyyy-MM-dd}',
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'detail', title: 'Details',
      width: 100,
      template: (item) => {
        return `<button class="btn-xs jt-common-button-style fileDetailLink">Details</button>`;
      },
      filterable: { extra: true, multi: true, search: true }
    }
  ];
  termInfo = this._pdfFinalSearch.getPageInformation();
  configTabList = [
    {selected: true, tabName: 'Thumbnails', prop: 'thumbnail'},
    {selected: false, tabName: 'List', prop: 'list'}
  ];
  pdfSearchModel = {
    magazineId: '',
    sourceCodeId: '',
    requestCodeId: '',
    vehicleCodeId: '',
    compCode: '',
    fileName: '',
    jobNumber: '',
    requestNumber: '',
    abcTagList: '', //send name instead of id...
    keywords: '',
    title: '',
    createdDateFrom: '',
    createdDateTo: ''
  };

  constructor(
    private _appStateService: AppStateService,
    private _pdfFinalSearch: PDFSearchService,
    private _dialogService: DialogService,
    private _searchStateService: SearchStateService
  ) {
    this._appStateService.subscribe(PDF_SEARCH_METADATA_RESULT, this.onMetaData.bind(this));
    this._appStateService.subscribe(PDF_SEARCH_RESULT, this.onSearchResult.bind(this));
    this._appStateService.subscribe(SEARCH_PDF_REG_THUMBNAIL_RESULT, this.onGeneratedThumbnailResult.bind(this));
    this._appStateService.subscribe(SEARCH_PDF_DOWNLOAD_MSG_RESULT, this.onReqDownloadFileMessage.bind(this));
    // this._appStateService.subscribe(SEARCH_PDF_REQUEST_NO, this.onRequestNumberInfo.bind(this));
  }

  ngOnInit() {
    this._appStateService.dispatch({
      type: PDF_SEARCH_METADATA
    });
  }

  onMetaData(action) {
    this.metadata = action.payload;
  }

  private onReqDownloadFileMessage(action) {
    const nextActionEvent = action.nextAction;
    const emptyFiles = action.payload.model;
    const fileUnavaliableDownload = [];
    let disableProcedBtn = false;
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
      const cachedFileInfo = (this.searchResultModel as any).itemSource;
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

  private onDownloadDialogContinue() {
    const dialogRef: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: DownloadResponsePopUpComponent
    });
    return dialogRef;
  }

  // private onRequestDialogContinue() {
  //   const dialogRef: DialogRef = this._dialogService.open({
  //     title: 'Request Number',
  //     content: RequestNumberPopUpComponent
  //   });
  //   return dialogRef;
  // }

  private onSelectAllOrClearAllBarSelection(resultModel, ticked) {
    const modResultModel = resultModel;
    modResultModel.itemSource = resultModel.itemSource.map((eachResult) => {
      eachResult.selected = ticked;
      return eachResult;
    });
    return modResultModel;
  }

  private onIndividualCardOrRowSelection(cardList, changedModel, ticked: boolean) {
    // After selecting individual card, make changes...
    const modifiedList = cardList;
    modifiedList.forEach((eachResult) => {
      if (eachResult.digAssetFileId === changedModel.digAssetFileId) {
        eachResult.selected = ticked;
      }
    });
    return modifiedList;
  }

  private mergeInformation(list, type) {
    return list.map((eachSelVal, index) => {
      return (index == 0) ? eachSelVal[type] : eachSelVal[type];
    }).join(',');
  }

  private onCardSelectionChanges() {
    const anyOneSelected = this.validateAnyCardSelected((this.searchResultModel as any).itemSource);
    const allSelected = this.validateAllCardSelected(((this.searchResultModel as any).itemSource));
    if (anyOneSelected && (!allSelected)) {
      this._pdfFinalSearch.setEnableButtonBarCombination('PARTIALSELECT', this.type, 'enable');
      // this.searchResultModel = Object.assign(this.searchResultModel, this.searchResultModel);
      // this.searchResultModel = JSON.parse(JSON.stringify(this.searchResultModel));
      // this.searchResultModel = this.updateModelList(this.searchResultModel);
      this.updateModelList(this.searchResultModel);
    } else if (anyOneSelected && allSelected) {
      this._pdfFinalSearch.setEnableButtonBarCombination('SELECTALL', this.type, 'enable');
      this.enableDisableDownloadBar();
      this.searchResultModel = Object.assign(this.searchResultModel, this.searchResultModel);
      this.updateModelList(this.searchResultModel);
    } else {
      //  TODO code refactor...
      this.defaultButtonBar();
      this.searchResultModel = this.onSelectAllOrClearAllBarSelection(this.searchResultModel, false);
      this.updateModelList(this.searchResultModel);
      // this.searchResultModel = this.updateModelList(this.searchResultModel);
      // const itemList = (this.searchResultModel as any).itemSource;
      // this.searchResultModel = Object.assign(this.searchResultModel, this.searchResultModel);
      // (this.searchResultModel as any).itemSource = JSON.parse(JSON.stringify(this.searchResultModel.itemSource));
    }
  }

  private updateModelList(resultModel) {
    this.thumbnailModel = JSON.parse(JSON.stringify(resultModel));
    this.gridModel = JSON.parse(JSON.stringify(resultModel));
  }

  private defaultButtonBar() {
    this.buttonBar.map((eachButton) => {
      eachButton.disable = eachButton.selected = true;
      if (eachButton.prop === 'SELECTALL') {  eachButton.disable = eachButton.selected = false; };
      if (eachButton.prop === 'EXPORT') {
        eachButton.selected = (this.type === 'Thumbnail') ? false : true;
        eachButton.disable = !eachButton.selected;
      }
    });
  }

  private validateAllCardSelected(cardList) {
    const cardSelCount = cardList.filter((eachCard) => {
      return eachCard.selected;
    }).length;
    return (cardList.length === cardSelCount);
  }

  private validateAnyCardSelected(cardList) {
    return cardList.some((eachCard) => {
      return eachCard.selected;
    });
  }

  private enableDisableDownloadBar() {
    const numCardSelected = this.nobSelectedCard((this.searchResultModel as any).itemSource);
    if (numCardSelected.length === 0 || numCardSelected.length > 10) {
      this.enableDisableDownloadButon(this.buttonBar, true);
    } else {
      this.enableDisableDownloadButon(this.buttonBar, false);
    }
  }

  private nobSelectedCard(cardList) {
    return cardList.filter((eachCard) => {
      return eachCard.selected;
    });
  }

  private enableDisableDownloadButon(buttonBar, selectAble: boolean) {
    buttonBar.forEach((eachButton) => {
      if (eachButton.prop === 'DOWNLOAD') {
        eachButton.disable = selectAble;
      }
    });
  }

  private getSelectedModel(cardList) {
    const idList = [];
    const itemList = [];
    cardList.forEach((eachCard) => {
      if (eachCard.selected) {
        idList.push(eachCard.digAssetFileId);
        itemList.push(eachCard);
      }
    });
    return { idList: idList, itemList: itemList };
  }

  private thumbnailPopUpDialog() {
    const dialog: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: ThumbnailResponsePopupComponent,
      actions: [{text: 'Okay'}]
    });
    return dialog;
  }

  private freshPDFSearch(pageInfo) {
    pageInfo.pageIndex = 1;
    pageInfo.hasNextPage = false;
    pageInfo.hasPreviousPage = false;
    pageInfo.totalPages = null;
    pageInfo.searched = false;
    pageInfo.totalItems = null;
    return pageInfo;
  }

  private fileDownloadModelChange(fileModel) {
    const modifiedFileModel = fileModel.map((eachFile) => {
      const fileObj = { key: eachFile.digAssetFileId, value: eachFile.filePath };
      return fileObj;
    });
    return modifiedFileModel;
  }

  private resetSearchDetails(searchDetails) {
    for (const i in searchDetails) {
      if (searchDetails[i])  {
        searchDetails[i] = '';
      }
    }
    return searchDetails;
  }

  private noResultFound() {
    this.searched = false;
    const dialogComp: DialogRef = this.noResultPopUp();
    const dialogRef = dialogComp.content.instance;
    dialogRef.errMsg = 'No results were found!';
  }

  private noResultPopUp() {
    const dialogComp: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: NoResultResponsePopupComponent,
      actions: [{text: 'Okay'}]
    });
    return dialogComp;
  }

  public onSearch(event) {
    //  TODO get all the fields information if present or just send search action only...
    if (this.pdfSearchModel.magazineId !== '') {
      this._pdfFinalSearch.setPageInformation(this.freshPDFSearch(this.termInfo));
      const searchInfo = JSON.parse(JSON.stringify(this.pdfSearchModel));
      searchInfo.createdDateFrom = (searchInfo.createdDateFrom) ? searchInfo.createdDateFrom : '';
      searchInfo.createdDateTo = (searchInfo.createdDateTo) ? searchInfo.createdDateTo : '';
      this._pdfFinalSearch.reqPdfSearch(searchInfo);
    }
  }

  public onClear(event) {
    this.searched = false;
    this.resetMultiSelect();
    this.resetTerm(this.termInfo);
    this.pdfSearchModel = this.resetSearchDetails(this.pdfSearchModel);
  }

  public resetMultiSelect() {
    this.clearField = JSON.parse(JSON.stringify({value : 1}));
  }

  public resetTerm(pageInfo) {
    pageInfo.pageSize = 25;
    pageInfo = this.freshPDFSearch(pageInfo);
    this._pdfFinalSearch.setPageInformation(pageInfo);
  }

  public onSearchResult(action) {
    if (action && action.payload.itemSource.length > 0) {
      this.searchResultModel = action.payload;
      this.updateModelList(this.searchResultModel);
      this.searched = this.termInfo.searched;
      this.termInfo = JSON.parse(JSON.stringify(this._pdfFinalSearch.getPageInformation()));
    } else {
      this.noResultFound();
    }
  }

  onStartDateValueChange(value) {
    const todayDate = <Date>new Date();
    const selectedDate = (value <= todayDate) ? (new Date(value)) : (new Date());
    this.pdfSearchModel.createdDateFrom = <any>selectedDate;
  }

  onEndDateValueChange(value) {
    const todayDate = <Date>new Date();
    const selectedDate = (value <= todayDate) ? (new Date(value)) : (new Date());
    this.pdfSearchModel.createdDateTo = <any>selectedDate;
  }

  public onTabSelection(selTabInfo) {
    this.type = selTabInfo.prop || this.type;
    this.buttonBar.forEach((eachButton) => {
      if (eachButton.prop === 'EXPORT') {
        eachButton.show = (this.type === 'list');
      }
    });
    //  TODO toggle button bar state based on tab selection...
  }

  public onDownloadAction(downloadFile) {
    //  TODO file exists to download...
    const modifiedFileModel = this.fileDownloadModelChange([downloadFile]);
    this.fileExistsToDownload(modifiedFileModel);
  }

  public onButtonBarAction(buttonBarInfo) {
    switch (buttonBarInfo.selAction) {
      case 'SELECTALL' :
        this._pdfFinalSearch.setEnableButtonBarCombination(buttonBarInfo.selAction, this.type, 'enable');
        this._pdfFinalSearch.setDisableButtonBarCombination(buttonBarInfo.selAction, this.type, 'disable');
        this.buttonBar.map((eachButton) => {
          if (eachButton.prop === 'EXPORT') {
            eachButton.show = (this.type === 'list') ? true : false;
            eachButton.disable = false;
          }
        });
        this.searchResultModel = this.onSelectAllOrClearAllBarSelection(this.searchResultModel, true);
        this.updateModelList(this.searchResultModel);
        break;
      case 'CLEARALL' :
        this._pdfFinalSearch.setEnableButtonBarCombination(buttonBarInfo.selAction, this.type, 'enable');
        this._pdfFinalSearch.setDisableButtonBarCombination(buttonBarInfo.selAction, this.type, 'disable');
        this.buttonBar.map((eachButton) => {
          if (eachButton.prop === 'EXPORT') {
            eachButton.show = (this.type === 'list') ? true : false;
            eachButton.disable = false;
          }
        });
        this.searchResultModel = this.onSelectAllOrClearAllBarSelection(this.searchResultModel, false);
        // this.searchResultModel = JSON.parse(JSON.stringify(this.searchResultModel));
        this.updateModelList(this.searchResultModel);
        break;
      case 'THUMBNAIL' :
        const selectedThumbnail = this.validateAnyCardSelected((this.searchResultModel as any).itemSource);
        if (selectedThumbnail) {
          // if any selected...button bar thumbnail next actions...
          // request thumbnail regenerate or else nothing...
          const selectedThumbnailInfo = this.getSelectedModel((this.searchResultModel as any).itemSource);
          this._pdfFinalSearch.reqThumbnailRegenerate({ids: selectedThumbnailInfo.idList});
        }
        break;
      case 'DOWNLOAD' :
        const selectedDownload = this.validateAnyCardSelected((this.searchResultModel as any).itemSource);
        if (selectedDownload) {
          const selectedDownloadInfo = this.getSelectedModel((this.searchResultModel as any).itemSource);
          const modifiedFileModel = this.fileDownloadModelChange(selectedDownloadInfo.itemList);
          this.fileExistsToDownload(modifiedFileModel);
        }
        break;
      case 'EXPORT' :
        this.isExporTriggered = true;
        break;
    }
  }

  private onGeneratedThumbnailResult(action) {
    // TODO replace also collect ids...and missing ids are replaced with empty
    const dialog = this.thumbnailPopUpDialog();
    const missingFileList = [];
    const idMissingList = action.payload.filter((eachThumbnail) => {
      return eachThumbnail.isFileMissing;
    });
    idMissingList.forEach((eachMissingId) => {
      (this.searchResultModel as any).itemSource.forEach((eachResult) => {
        if (eachResult.digAssetFileId === eachMissingId.digAssetFileId) {
          eachResult.thumbnail = eachMissingId.thumbnail;
          eachResult.fileExtension = 'PDF';
          missingFileList.push(eachResult.fileName);
        }
      });
    });
    const dialogRef = dialog.content.instance;
    dialogRef.setCustomIdTitle = 'File Missing';
    dialogRef.setFileContent = missingFileList;
  }

  private fileExistsToDownload(downloadFile) {
    // this.downloadServerFormat = 
    this._searchStateService.downloadFileExists(downloadFile, SEARCH_PDF_DOWNLOAD_MSG_RESULT, SEARCH_PDF_DOWNLOAD_RESULT)
  }

  // private onRequestNumberInfo(action) {
  //   const dialogReqPopUp: DialogRef = this.onRequestDialogContinue();
  //   const dialogRequestNumberCompRef = dialogReqPopUp.content.instance;
  //   dialogRequestNumberCompRef.gridId = 'pdfRequestNoGrid';
  //   dialogRequestNumberCompRef.requestInfo = action.payload.model;
  // }

  public valChanged(valChangedInfo) {
    const valList = valChangedInfo.selVal;
    const valLen = valChangedInfo.selVal.length;
    const propType = valChangedInfo.type;
    switch (propType) {
      case 'magazineId' :
      case 'sourceCodeId' :
      case 'requestCodeId' :
      case 'vehicleCodeId' :
      case 'abcTagList' :
        this.pdfSearchModel[propType] = this.mergeInformation(valList, 'key');
        break;
      case 'compCode' :
        this.pdfSearchModel[propType] = this.mergeInformation(valList, 'code');
        break;
      case 'requestNumber' :
        break;
    }
  }

  public onThumbNailActionUpdate(thumbnailInfo) {
    //  TODO thumbnail clicked trigger appropriate action...
    let cardList = (this.searchResultModel as any).itemSource;
    cardList = this.onIndividualCardOrRowSelection(cardList, thumbnailInfo, thumbnailInfo.selected);
    (this.searchResultModel as any).itemSource = cardList;
    this.searchResultModel = Object.assign(this.searchResultModel, this.searchResultModel);
    this.onCardSelectionChanges();
    this.enableDisableDownloadBar();
  }

  public onGridRowActionUpdate(gridInfo) {
    let cardList = (this.searchResultModel as any).itemSource;
    cardList = this.onIndividualCardOrRowSelection(cardList, gridInfo, gridInfo.selected);
    (this.searchResultModel as any).itemSource = cardList;
    this.searchResultModel = Object.assign(this.searchResultModel, this.searchResultModel);
    this.onCardSelectionChanges();
    this.enableDisableDownloadBar();
  }

  public onPageChangeAction(pageChange) {
    this.termInfo.pageIndex = pageChange;
    this._pdfFinalSearch.setPageInformation(this.termInfo);
    this._pdfFinalSearch.reqPdfSearch(this.pdfSearchModel);
  }

  public onPageSizeChangeAction(pageSizeChange) {
    this.termInfo.pageSize = pageSizeChange;
    const pageInfo = this.freshPDFSearch(this.termInfo);
    this._pdfFinalSearch.setPageInformation(pageInfo);
    this._pdfFinalSearch.reqPdfSearch(this.pdfSearchModel);
  }

  // openRequestPopUp() {
  //   this._pdfFinalSearch.retrieveRequestNumber();
  // }

  // public onDownloadAction(downloadFile) {
  //   //TODO file exists to download...
  //   this.fileExistsToDownload(downloadFile);
  // }
}
