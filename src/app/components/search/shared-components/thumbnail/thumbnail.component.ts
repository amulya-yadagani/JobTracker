import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit, Input } from '@angular/core';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs/Observable';
import {
  AppStateService,
  SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT,
  SEARCH_PDF_THUMBNAIL_DETAILS_RESULT,
  COVER_SEARCH_THUMBNAIL_DETAILS_RESULT
} from '../../../../state/app-state.service';
import { SearchStateService } from '../../search-state.service';
import { FileDetailsPopUpComponent } from '../../shared-components/file-details/file-details-popup/file-details-popup.component';
import { SEARCH_GLOBAL_FILEID } from '../../../../utils/constants';
import { removeFileExt, getErrorAction } from '../../../../utils/utils';

const $ = window['$'];
@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit, AfterViewInit {
  @Output() onThumbNailAction = new EventEmitter();
  @Output() onPageChange = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();
  @Input()
  public set onResultRecieved(onResultRecieved) {
    if (onResultRecieved && onResultRecieved.itemSource && onResultRecieved.itemSource.length > 0) {
      this.formatFileExt(onResultRecieved);
      this.updatePageInformation(onResultRecieved);
      this.resultInformation = onResultRecieved.itemSource;
    }
  }
  @Input()
  public set onPageInformationChanges(setSearchedPageInformation) {
    if (setSearchedPageInformation) {
      this.trackPageSize = setSearchedPageInformation.pageSize;
      this.pageInformation = setSearchedPageInformation;
      this.searched = setSearchedPageInformation.searched;
    }
  }
  @Input()
  public set onDetailUrl(detailUrl: string) {
    if (detailUrl) {
      this.detailsURL = detailUrl;
    }
  }
  @Input()
  public set onDownloadUrl(urlInfo: string) {
    if (urlInfo) {
      this.downloadUrl = urlInfo;
    }
  }
  @Input() set onDetailEvents(detailsEventInfo) {
    if (detailsEventInfo) {
      this.detailThumbnailEvents = detailsEventInfo;
    }
  };
  detailThumbnailEvents;
  detailsURL: string;
  downloadUrl: string;
  searched: boolean = false;
  pageInformation;
  resultInformation = [];
  trackPageChangeIndex: number;
  trackPageIndex: number;
  trackPageSize: number;
  trackHasNext: boolean = false;
  trackHasPrevious: boolean = false;
  trackTotalItemSize: number;
  trackTotalPageSize: number;
  trackPageTerm: string;
  trackPageLogic: boolean;
  searchedResult: boolean;
  constructor(
    private _appStateService: AppStateService,
    private _searchStateService: SearchStateService,
    private _dialogService: DialogService
  ) {
    this._appStateService.subscribe(SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT, this.onGlobalThumbnailDetails.bind(this));
    this._appStateService.subscribe(SEARCH_PDF_THUMBNAIL_DETAILS_RESULT, this.onPDFThumbnailDetails.bind(this));
    this._appStateService.subscribe(COVER_SEARCH_THUMBNAIL_DETAILS_RESULT, this.onGlobalThumbnailDetails.bind(this));
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.updateToolTipInformation();
  }
  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
  }

  ngAfterContentChecked() {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
  }

  formatFileExt(resultInfo) {
    // Try to remove file Extension and return result information back...
    resultInfo.itemSource = resultInfo.itemSource.map((eachItem) => {
      eachItem.fileName = removeFileExt(eachItem.fileName);
      return eachItem;
    });
    return resultInfo;
  }

  updatePageInformation(pageInfo) {
    this.trackPageIndex = pageInfo.pageIndex;
    this.trackPageChangeIndex = pageInfo.pageIndex;
    this.trackTotalItemSize = pageInfo.totalItems;
    this.trackTotalPageSize = pageInfo.totalPages;
    this.trackHasNext = pageInfo.hasNextPage;
    this.trackHasPrevious = pageInfo.hasPreviousPage;
  }

  updateToolTipInformation() {
    const toolTipList = document.getElementsByClassName('jt-thumbnail-tooltip');
    if (toolTipList) {
      const toolTip = Array.from(toolTipList);
      toolTip.map((eachToolTip: any, index) => {
        $(eachToolTip).tooltip({
          placement: 'top'
        });
      });
    }
  }

  onResultActionUpdate(action) {
    switch (action.selAction) {
      case 'SELECTALL' :
        this.resultInformation.forEach((eachResult) => {
          eachResult.selected = true;
        });
        break;
      case 'CLEARALL' :
        this.resultInformation.forEach((eachResult) => {
          eachResult.selected = false;
        });
        break;
    }
  }

  onShowDetails(thumbNailDetail) {
    // gets requested fileId via ajax
    this._appStateService.showLoader(true);
    switch (this.detailThumbnailEvents) {
      case SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT:
        this._searchStateService.getFileId(thumbNailDetail.digAssetFileId, SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT, thumbNailDetail);
        break;
      case SEARCH_PDF_THUMBNAIL_DETAILS_RESULT:
        this._searchStateService.getFileId(thumbNailDetail.digAssetFileId, SEARCH_PDF_THUMBNAIL_DETAILS_RESULT, thumbNailDetail);
        break;
      case COVER_SEARCH_THUMBNAIL_DETAILS_RESULT:
      this._searchStateService.getFileId(thumbNailDetail.digAssetFileId, COVER_SEARCH_THUMBNAIL_DETAILS_RESULT, thumbNailDetail);
        break;
    }
  }

  onGlobalThumbnailDetails(action) {
    //If the type does not match, do not render details popup. Since we are using/creating
    //this component more than once, this function will be trigerred for all the instances
    //To avoid multiple popups, this check is put
    if(action.type != this.detailThumbnailEvents) {
      return;
    }

    const dialogRef = this.openModelWindow();
    const thumbnailDetails = action.cardInfo;
    const response = action.payload.model;
    const colFields = Object.keys(response[0]);
    const detailModel = this.onDetailColumnFormatFieldSet(response, colFields);
    this.onDisplayDetails(dialogRef, detailModel, colFields, thumbnailDetails, 'GLOBALSEARCH');
  }

  onPDFThumbnailDetails(action) {
    //If the type does not match, do not render details popup. Since we are using/creating
    //this component more than once, this function will be trigerred for all the instances
    //To avoid multiple popups, this check is put
    if (action.type != this.detailThumbnailEvents) {
      return;
    }

    const dialogRef = this.openModelWindow();
    const thumbnailDetails = action.cardInfo;
    const response = action.payload.model;
    const colFields = Object.keys(response[0]);
    const detailModel = this.onDetailColumnFormatFieldSet(response, colFields);
    this.onDisplayDetails(dialogRef, detailModel, detailModel, thumbnailDetails, 'PDFSEARCH');
  }

  onDisplayDetails(dialogRef, detailModel, colFields, thumbnailDetails, searchType) {
    const dialogCompInfo = dialogRef.content.instance;
    dialogCompInfo.setDigitalInformation = detailModel;
    dialogCompInfo.thumbnailInformation = thumbnailDetails;
    dialogCompInfo.searchType = searchType;
  }

  onFormatField(unFormatData) {
    // Used to mapped key information intendation is done and data is returned...
    const formatData = this._searchStateService.getAssetPropertyValue(unFormatData);
    return formatData;
  }

  onDetailColumnFormatFieldSet(fieldModelSet, fieldList) {
    // response Model transform/modification according to grid Model scheme requirement...
    let modelTemplate = [];
    fieldModelSet.forEach((eachResp) => {
      const fieldSet = fieldList.map((eachField, index) => {
        // modifed date or by not specified replace it with original author...
        if (eachField.modifiedDate === "") {
          eachField.modifiedDate = eachField.createdDate || '';
        }
        if (eachField.modifiedBy === "") {
          eachField.modifiedBy = eachField.uploadedBy || '';
        }
        const value = this._searchStateService.formateDate(fieldList[index], eachResp[fieldList[index]]);
        return { property : this.onFormatField(fieldList[index]), value: (value || '') };
      });
      modelTemplate = fieldSet;
    });
    return modelTemplate;
  }

  // onPDFFormatFieldSet(fieldModelSet, fieldList) {
  //   let modelTemplate = [];
  //   fieldModelSet.forEach((eachResp) => {
  //     const fieldSet = fieldList.map((eachField, index) => {
  //       // return { property : fieldList[index], value: eachResp[fieldList[index]] };
  //       if (eachField.modifiedDate === "") {
  //         eachField.modifiedDate = eachField.createdDate || '';
  //       }
  //       if (eachField.modifiedBy === "") {
  //         eachField.modifiedBy = eachField.uploadedBy || '';
  //       }
  //       const value = this._searchStateService.formateDate(fieldList[index], eachResp[fieldList[index]]);
  //       return { property : this.onFormatField(fieldList[index]), value: (value || '') };
  //     });
  //     modelTemplate = fieldSet;
  //   });
  //   return modelTemplate;
  // }

  openModelWindow() {
    const dialogRef: DialogRef = this._dialogService.open({
      title: 'Digital Asset Details',
      content: FileDetailsPopUpComponent
    });
    return dialogRef;
  }

  onChkSelectionChanges(selectedInfo) {
    this.onThumbNailAction.emit(selectedInfo);
  }

  onBackWardAction() {
    if (!this.trackHasPrevious) {
      return;
    }
    const pageIndexChanged = 1;
    this.onPageChange.emit(pageIndexChanged);
  }

  onBackAction() {
    if (!this.trackHasPrevious) {
      return;
    }
    const pageIndexChanged = this.trackPageIndex - 1;
    this.onPageChange.emit(pageIndexChanged);
  }

  onNextAction() {
    if (!this.trackHasNext) {
      return;
    }
    const pageIndexChanged = this.trackPageIndex + 1;
    this.onPageChange.emit(pageIndexChanged);
  }

  onForwardAction() {
    if (!this.trackHasNext) {
      return;
    }
    const pageIndexChanged = this.trackTotalPageSize;
    this.onPageChange.emit(pageIndexChanged);
  }

  onPageSizeChangeAction() {
    const pageSizeChanged = this.trackPageSize;
    this.onPageSizeChange.emit(pageSizeChanged);
  }

  onPageIndexChangeAction() {
    if (!isNaN(this.trackPageChangeIndex) && this.trackPageChangeIndex > 0 && this.trackPageChangeIndex <= this.trackTotalPageSize) {
      this.onPageChange.emit(this.trackPageChangeIndex);
    }
  }

  handleError(fnName, err:any,caught): any {
    this._appStateService.showLoader(false);
    console.log(`jt-thumbnail: ${err.status} Message: ${err.statusText}`);

    /* const nAction = {
        type: NOTIFICATION,
        payload: {msg: `${GET_ACCOUNTS_ERROR}: ${err.statusText}`}
    };

    this.stateService.dispatch(nAction);*/

    const errAction = getErrorAction(err, fnName, "jt-thumbnail.component.ts");
    this._appStateService.dispatch(errAction);

    //Return observable that emits empty array. This will call fn passed to subscribe() with value as []
    return Observable.of([]);
  }
}