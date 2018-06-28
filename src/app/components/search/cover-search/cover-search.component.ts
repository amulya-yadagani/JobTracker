import { Component, OnInit } from '@angular/core';
import { CoverSearchService } from "./cover-search.service";
import { removeFileExt } from '../../../utils/utils';
import {
  AppStateService,
  COVER_SEARCH_METADATA_RESULT,
  COVER_SEARCH_METADATA,
  PDF_SEARCH_RESULT,
  COVER_SEARCH_RESULT,
  COVER_SEARCH_THUMBNAIL_DETAILS_RESULT,
  SEARCH_COVER_REG_THUMBNAIL_RESULT,
  SEARCH_COVER_DOWNLOAD_RESULT,
  SEARCH_COVER_DOWNLOAD_MSG_RESULT,
  COVER_SEARCH_CIRCMAN_METADATA,
  COVER_SEARCH_CIRCMAN_METADATA_RESULT
} from '../../../state/app-state.service';
import { SEARCH_GLOBAL_DOWNLOAD } from "../../../utils/constants";
import { ThumbnailResponsePopupComponent } from '../shared-components/thumbnail-response-popup/thumbnail-response-popup.component';
import { SearchStateService } from '../search-state.service';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';

let $ = null;
@Component({
  selector: 'app-cover-search',
  templateUrl: './cover-search.component.html',
  styleUrls: ['./cover-search.component.scss']
})

export class CoverSearchComponent implements OnInit {
  isSearchActive: boolean = true;
  isUploadActive: boolean = false;
  _searchResultModel = {};
  buttonBar = this.coverService.resultActionModel;
  detailEventsThumbnail = COVER_SEARCH_THUMBNAIL_DETAILS_RESULT || '';
  type: string = 'thumbnail';
  clearField = { value: 0 };
  btnConfig;
  magazineObj;
  magazineUploadObj;
  search = {
    specialIssue: "No"
  };
  upload = {
    specialIssue: "No"
  };
  isCircmanMagazine: boolean;
  searched = false;
  /**
   * Holds dropdown values for select fields
   */
  metadata: any = {};
  issueDataValues: any = [];
  searchIssueDate: any = {};

  configTabList = [
    { selected: true, tabName: 'Thumbnails', prop: 'thumbnail' },
    { selected: false, tabName: 'List', prop: 'list' }
  ];

  columnConfig = [
    {
      field: 'fileType', title: 'File Type',
      template: (item) => {
        return `<div>${item.fileType}</div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'fileName', title: 'File Name',
      template: (item) => {
        return `<div>
            <a class="fileHyperLink" style='color: steelblue;' href='javascript:void(0)'>
              ${removeFileExt(item.fileName)}  
            </a>
          </div>`;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'fileExtension', title: 'Extension',
      template: (item) => {
        return `<div>${item.fileExtension}</div>`;
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
      field: 'dateEntered', title: 'Date Entered',
      template: (item) => {
        return `<div>${new Date(item.dateEntered).toLocaleDateString()}</div>`;
      },
      format: '{0:yyyy-MM-dd}',
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    }
  ];

  termInfo = this.coverService.getPageInformation();
  isExporTriggered = false;
  detailEventsGrid = {};

  constructor(private stateService: AppStateService, private coverService: CoverSearchService, private _dialogService: DialogService, private _searchStateService: SearchStateService) {
    this.stateService.subscribe(COVER_SEARCH_METADATA_RESULT, this.onMetaData.bind(this));
    this.stateService.subscribe(COVER_SEARCH_RESULT, this.onSearchedResult.bind(this));
    this.stateService.subscribe(SEARCH_COVER_REG_THUMBNAIL_RESULT, this.onGeneratedThumbnailResult.bind(this));
    this.stateService.subscribe(COVER_SEARCH_CIRCMAN_METADATA_RESULT, this.issueDateDropdown.bind(this))
    $ = window['jQuery'];
  }

  onTabSelection(selTab) {
    this.type = selTab.prop || this.type;
    this.buttonBar.forEach((eachButton) => {
      if (eachButton.prop === 'EXPORT') {
        eachButton.show = (this.type === 'list');
      }
    });
  }

  issueDateDropdown(action) {
    this.issueDataValues = action.payload;
  }

  onSearchedResult(action) {
    if (action && action.payload) {
      this._searchResultModel = action.payload.model;
      this.searched = this.termInfo.searched;;
      this.termInfo = JSON.parse(JSON.stringify(this.coverService.getPageInformation()));
    }
  }

  searchIssueDateChange(issueDate: string) {
    let selectedIssueDate = JSON.parse(issueDate);
    if (selectedIssueDate) {
      this.search['issueNumber'] = selectedIssueDate.issue;
    }
  }

  validateMonth(month) {
    if (month < 1 || month > 12) {
      this.search['issueMonth'] = null;
    }
  }

  validateYear(year) {
    if (typeof year !== "number" || year < 1900 || year > new Date().getFullYear()) {
      this.search['issueYear'] = null;
    }
  }

  onGeneratedThumbnailResult(action) {
    // TODO replace also collect ids...and missing ids are replaced with empty
    const dialog = this.thumbnailPopUpDialog();
    let missingFileList = [];
    const idMissingList = action.payload.filter((eachThumbnail) => {
      return eachThumbnail.isFileMissing;
    });
    idMissingList.forEach((eachMissingId) => {
      (this._searchResultModel as any).itemSource.forEach((eachResult) => {
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


  private thumbnailPopUpDialog() {
    const dialog: DialogRef = this._dialogService.open({
      title: 'Warning:',
      content: ThumbnailResponsePopupComponent,
      actions: [{ text: 'Okay' }]
    })
    return dialog;
  }

  // onGetSetTab(classify, tabList = [], selTab?) {
  //   switch (classify) {
  //     case 'SET':
  //       tabList.forEach((eachTab) => {
  //         eachTab.selected = (eachTab.prop === selTab.prop) ? true : false;
  //       });
  //       return tabList;
  //     case 'GET':
  //       const tab = tabList.find((eachTab) => {
  //         return eachTab.selected;
  //       });
  //       return tab;
  //   }
  // }

  checkActive() {
    setTimeout(() => {
      if ($('ul.cover-search li#searchList.active').length) {
        this.isSearchActive = true;
        this.isUploadActive = false;
      } else if ($('ul.cover-search li#uploadList.active').length) {
        this.isSearchActive = false;
        this.isUploadActive = true;
      }
    }, 20)
  }

  ngOnInit() {
    this.checkActive();
    this.stateService.dispatch({
      type: COVER_SEARCH_METADATA
    });

    this.btnConfig = this.coverService.resultActionModel;
  }

  onSearch(event) {
    this.coverService.setPageInformation(this.freshCoverSearch(this.termInfo));
    this.coverService.onRequestGetModel({
      "searchParameter": "br",
      "isAnd": true,
      "pageIndex": 1,
      "pageSize": 25
    });

  }

  onClear(event) {
    this.searched = false;
    this.resetMultiSelect();
    this.resetTerm(this.termInfo);
  }

  public resetMultiSelect() {
    this.clearField = JSON.parse(JSON.stringify({ value: 1 }));
  }

  public resetTerm(pageInfo) {
    pageInfo.pageSize = 25;
    pageInfo = this.freshCoverSearch(pageInfo);
    this.coverService.setPageInformation(pageInfo);
    this.search = {
      specialIssue: "No"
    };
    this.magazineObj = null;
  }

  private freshCoverSearch(pageInfo) {
    pageInfo.pageIndex = 1;
    pageInfo.hasNextPage = false;
    pageInfo.hasPreviousPage = false;
    pageInfo.totalPages = null;
    pageInfo.searched = false;
    pageInfo.totalItems = null;
    return pageInfo;
  }
  
  searchValueChange(value) {
    if (value) {
      this.search['magazine'] = value.key;
      this.search['issueDate'] = "";
      this.search['issueNumber'] = null;
      if (value.circmanIndicator !== "\u0000") {
        this.isCircmanMagazine = true;
        this.stateService.dispatch({
          type: COVER_SEARCH_CIRCMAN_METADATA,
          code: value.code,
          id: value.circmanIndicator
        });
      } else {
        this.isCircmanMagazine = false;
      }
    }
  }

  uploadValueChange(value) {
    if (value) {
      this.upload['magazine'] = value.key;
    }
  }

  onMetaData(action) {
    this.metadata = action.payload;
  }

  validateIssueMonth(e, issueMonth) {
    if (issueMonth < 0 || issueMonth > 12) {
      e.preventDefault();
    }
  }

  private onThumbNailBarSelection(resultModel, ticked) {
    const modResultModel = resultModel.itemSource.map((eachResult) => {
      eachResult.selected = ticked;
      return eachResult;
    });
    return modResultModel;
  }

  private getSelectedModel(cardList) {
    let idList = [];
    let itemList = [];
    cardList.forEach((eachCard) => {
      if (eachCard.selected) {
        idList.push(eachCard.digAssetFileId);
        itemList.push(eachCard);
      }
    });
    return { idList: idList, itemList: itemList };
  }

  private fileExistsToDownload(downloadFile) {
    // this.downloadServerFormat = 
    this._searchStateService.downloadFileExists(downloadFile, SEARCH_COVER_DOWNLOAD_MSG_RESULT, SEARCH_COVER_DOWNLOAD_RESULT)
  }

  public onDownloadAction(downloadFile) {
    //TODO file exists to download...
    this.fileExistsToDownload(downloadFile);
  }

  public onButtonBarAction(buttonBarInfo) {
    switch (buttonBarInfo.selAction) {
      case 'SELECTALL':
        this.coverService.setEnableButtonBarCombination(buttonBarInfo.selAction, this.type, 'enable');
        this.coverService.setDisableButtonBarCombination(buttonBarInfo.selAction, this.type, 'disable');
        this.buttonBar.map((eachButton) => {
          if (eachButton.prop === 'EXPORT') {
            eachButton.show = (this.type === 'list') ? true : false;
            eachButton.disable = false;
          }
        });
        this.onThumbNailBarSelection(this._searchResultModel, true);
        break;
      case 'CLEARALL':
        this.coverService.setEnableButtonBarCombination(buttonBarInfo.selAction, this.type, 'enable');
        this.coverService.setDisableButtonBarCombination(buttonBarInfo.selAction, this.type, 'disable');
        this.buttonBar.map((eachButton) => {
          if (eachButton.prop === 'EXPORT') {
            eachButton.show = (this.type === 'list') ? true : false;
            eachButton.disable = false;
          }
        });
        this.onThumbNailBarSelection(this._searchResultModel, false);
        break;
      case 'THUMBNAIL':
        const selectedThumbnail = this.validateAnyCardSelected((this._searchResultModel as any).itemSource);
        if (selectedThumbnail) {
          // if any selected...button bar thumbnail next actions...
          // request thumbnail regenerate or else nothing...
          const selectedThumbnailInfo = this.getSelectedModel((this._searchResultModel as any).itemSource);
          this.coverService.reqThumbnailRegenerate({ ids: selectedThumbnailInfo.idList });
        }
        break;
      case 'DOWNLOAD':
        const selectedDownload = this.validateAnyCardSelected((this._searchResultModel as any).itemSource);
        if (selectedDownload) {
          const selectedDownloadInfo = this.getSelectedModel((this._searchResultModel as any).itemSource);
          this.fileExistsToDownload(selectedDownload);
        }
        break;
      case 'EXPORT':
        break;
    }
  }

  onThumbNailIndividualSelection(cardList, changedModel, ticked: boolean) {
    // After selecting individual card, make changes...
    const modifiedList = cardList;
    modifiedList.forEach((eachResult) => {
      if (eachResult.digAssetFileId === changedModel.digAssetFileId) {
        eachResult.selected = ticked;
      }
    });
    return modifiedList;
  }

  private onCardSelectionChanges() {
    const anyOneSelected = this.validateAnyCardSelected((this._searchResultModel as any).itemSource);
    const allSelected = this.validateAllCardSelected(((this._searchResultModel as any).itemSource))
    if (anyOneSelected && (allSelected === false)) {
      this.coverService.setEnableButtonBarCombination('PARTIALSELECT', this.type, 'enable');
    } else if (anyOneSelected && allSelected) {
      this.coverService.setEnableButtonBarCombination('SELECTALL', this.type, 'enable');
      this.coverService.setEnableButtonBarCombination('SELECTALL', this.type, 'disable');
    } else {
      this.coverService.setDisableButtonBarCombination('CLEARALL', this.type, 'enable');
      this.coverService.setDisableButtonBarCombination('CLEARALL', this.type, 'disable');
    }
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

  private enableDisableDownloadBar() {
    const numCardSelected = this.nobSelectedCard((this._searchResultModel as any).itemSource);
    if (numCardSelected.length === 0 || numCardSelected.length > 10) {
      this.enableDisableDownloadButon(this.buttonBar, true);
    } else {
      this.enableDisableDownloadButon(this.buttonBar, false);
    }
  }

  public onThumbNailActionUpdate(thumbnailInfo) {
    //TODO thumbnail clicked trigger appropriate action...
    let cardList = (this._searchResultModel as any).itemSource;
    cardList = this.onThumbNailIndividualSelection(cardList, thumbnailInfo, thumbnailInfo.selected);
    (this._searchResultModel as any).itemSource = cardList;
    Object.assign(this._searchResultModel, this._searchResultModel);
    this.onCardSelectionChanges();
    this.enableDisableDownloadBar();
  }

  public onPageChangeAction(pageChange) {
    // this.termInfo.pageIndex = pageChange;
    // this.coverService.setPageInformation(this.termInfo);
    // this.coverService.reqPdfSearch(this.pdfSearchModel);
  }

  public onPageSizeChangeAction(pageSizeChange) {
    this.termInfo.pageSize = pageSizeChange;
    const pageInfo = this.freshCoverSearch(this.termInfo);
    this.coverService.setPageInformation(pageInfo);
    // this.coverService.reqPdfSearch(this.pdfSearchModel);
  }

  onGridRowActionUpdate(e) {

  }

}