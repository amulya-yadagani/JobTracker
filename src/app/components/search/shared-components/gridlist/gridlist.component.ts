import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';
import {
  AppStateService,
  SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT,
  SEARCH_PDF_DOWNLOAD_RESULT,
  SEARCH_PDF_GRID_DETAILS_RESULT
} from '../../../../state/app-state.service';
import { getErrorAction } from '../../../../utils/utils';
import { Observable } from 'rxjs/Observable';
import { SearchStateService } from '../../search-state.service';
import { FileDetailsPopUpComponent } from '../../shared-components/file-details/file-details-popup/file-details-popup.component';

let $;
@Component({
  selector: 'app-gridlist',
  templateUrl: './gridlist.component.html',
  styleUrls: ['./gridlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridlistComponent implements OnInit, AfterViewInit {
  @Output() onGridListAction = new EventEmitter();
  @Output() onPageChange = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();
  @Output() onDownloadSelect = new EventEmitter();
  @Input('onExportName') exportName;
  @Input()
  public set onGridId(onGridId) {
    if (onGridId) {
      this.gridRefId = onGridId;
    }
  }
  @Input()
  public set onColumnConfig(configCol) {
    if (configCol) {
      this.setConfigCol = configCol;
    }
  }
  @Input()
  public set onDetailUrl(urlInfo: string) {
    this.detailsUrl = urlInfo;
  }
  @Input()
  public set onDownloadUrl(urlInfo: string) {
    if (urlInfo) {
      this.downloadUrl = urlInfo;
    }
  }
  @Input()
  public set onPageInformationChanges(searchedPageInformation) {
    if (searchedPageInformation) {
      this.trackPageSize = searchedPageInformation.pageSize;
      this.pageInformation = searchedPageInformation;
      this.searched = searchedPageInformation.searched;
    }
  }
  @Input()
  public set onResultRecieved(onResultRecieved) {
    if (onResultRecieved && onResultRecieved.itemSource && onResultRecieved.itemSource.length > 0) {
      this.updatePageInformation(onResultRecieved);
      this.resultInformation = onResultRecieved.itemSource;
      this.onUpdateGrid(this.resultInformation);
    }
  }
  @Input()
  public set onExportGrid(onExportChanges) {
    if (onExportChanges) {
      this.gridRef.saveAsExcel();
    }
  }
  @Input()
  public set onDetailEvents(detailsEventInfo) {
    if (detailsEventInfo) {
      this.detailGridListEvents = detailsEventInfo;
    }
  }
  detailGridListEvents;
  gridRefId: string;
  detailsUrl: string;
  downloadUrl: string;
  gridRef;
  pageInformation;
  trackPageChangeIndex: number;
  trackPageIndex: number;
  trackPageSize: number;
  trackHasNext: boolean = false;
  trackHasPrevious: boolean = false;
  trackTotalItemSize: number;
  trackTotalPageSize: number;
  trackPageTerm: string;
  trackPageLogic: boolean;
  searched: boolean;
  resultInformation = [];
  setConfigCol;
  pageSize;

  constructor(
    private _appStateService: AppStateService,
    private _searchStateService: SearchStateService,
    private _dialogService: DialogService
  ) {
    $ = window['jQuery'];
    this._appStateService.subscribe(
      SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT,
      this.onGlobalThumbnailDetails.bind(this)
    );
    this._appStateService.subscribe(
      SEARCH_PDF_GRID_DETAILS_RESULT,
      this.onPDFThumbnailDetails.bind(this)
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.onGenerateGrid();
  }

  onGenerateGrid() {
    $('#' + this.gridRefId).kendoGrid({
      dataSource: { data: [] },
      noRecords: true,
      excel: {
        allPages: true,
        fileName: this.exportName + '.xlsx'
      },
      selectable: 'multiple,row',
      excelExport: this.onGenerateExcel.bind(this),
      scrollable: true,
      sort: this.onSortRequest.bind(this),
      resizable: true,
      filterable: false,
      sortable: true,
      columns: this.setConfigCol,
      dataBound: this.onGenerateFileLink.bind(this),
      change: this.onGridSelected.bind(this)
    });
    this.gridRef = $('#' + this.gridRefId).data('kendoGrid');
  }

  onUpdateGrid(resultInformation) {
    this.gridRef.dataSource.data(resultInformation);
    this.gridRef.dataSource.fetch();
  }

  onGenerateExcel() {}

  onGenerateFileLink(e: Event) {
    if (e) {
      this.preFetchSelectedRow((e as any).sender.dataSource.data());
      (e as any).sender.element.find('.fileDetailLink').bind('click', event => {
        const gridRef = $('#' + this.gridRefId).data('kendoGrid');
        const rowRef = gridRef.dataItem($(event.target).closest('tr'));
        const rowIndex = $(event.target)
          .closest('tr')
          .index();
        // const digitalId = rowRef.digAssetFileId;
        this.onClickSelectedLink(rowRef, rowIndex);
      });
      (e as any).sender.element.find('.fileHyperLink').bind('click', event => {
        const gridRef = $('#' + this.gridRefId).data('kendoGrid');
        const rowRef = gridRef.dataItem($(event.target).closest('tr'));
        this.onClickFileLink(rowRef);
      });
    }
  }

  preFetchSelectedRow(dataSourceList) {
    if (dataSourceList) {
      dataSourceList.map(eachDataSource => {
        if (eachDataSource.selected) {
          const selectedRowElement = this.gridRef.tbody.find(
            'tr[data-uid="' + eachDataSource.uid + '"]'
          );
          selectedRowElement.addClass('selectedRow');
        }
      });
    }
  }

  onGridSelected(e: Event) {
    const selectedRowDataSource = this.gridRef.dataItem(this.gridRef.select());
    const selectedRowElement = this.gridRef.tbody.find(
      'tr[data-uid="' + this.gridRef.dataItem(this.gridRef.select()).uid + '"]'
    );
    const isRowChecked = this.onSelectedRow(selectedRowElement);
    const selectedRowData = this.getfoundSelectedRowData(
      isRowChecked,
      this.resultInformation,
      selectedRowDataSource.digAssetFileId
    );
    this.onGridListAction.emit(selectedRowData);
  }

  getfoundSelectedRowData(selectInfo, fileList, fileId) {
    return fileList.filter(eachFile => {
      if (eachFile.digAssetFileId === fileId) {
        eachFile.selected = selectInfo;
        return eachFile;
      }
    })[0];
  }

  onSelectedRow(selRowElm) {
    if (selRowElm.hasClass('selectedRow')) {
      selRowElm.removeClass('selectedRow');
      selRowElm.removeClass('k-state-selected');
      return false;
    } else {
      selRowElm.addClass('selectedRow');
      return true;
    }
  }

  onClickFileLink(fileInfo) {
    // sends information related download info on click...
    this.onDownloadSelect.emit(fileInfo);
  }

  onClickSelectedLink(rowRefInfo, rowIndex) {
    this.onReqFileIdGetInfo(rowRefInfo);
  }

  onSortRequest(event: Event) {}

  onReqFileIdGetInfo(thumbNailDetail) {
    this._appStateService.showLoader(true);
    switch (this.detailGridListEvents) {
      case SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT:
        this._searchStateService.getFileId(
          thumbNailDetail.digAssetFileId,
          SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT,
          this.onPropertyExists(thumbNailDetail)
        );
        break;
      case SEARCH_PDF_GRID_DETAILS_RESULT:
        this._searchStateService.getFileId(
          thumbNailDetail.digAssetFileId,
          SEARCH_PDF_GRID_DETAILS_RESULT,
          this.onPropertyExists(thumbNailDetail)
        );
        break;
    }
  }

  onGlobalThumbnailDetails(action) {
    // If the type does not match, do not render details popup. Since we are using/creating
    // this component more than once, this function will be trigerred for all the instances
    // To avoid multiple popups, this check is put
    if (action.type != this.detailGridListEvents) {
      return;
    }
    const dialogRef = this.openModelWindow();
    const thumbnailDetails = action.cardInfo;
    const response = action.payload.model;
    const colFields = Object.keys(response[0]);
    // const detailModel = this.onGlobalFormatFieldSet(response, colFields);
    const detailModel = this.onDetailColumnFormatFieldSet(response, colFields);
    this.onDisplayDetails(
      dialogRef,
      detailModel,
      colFields,
      thumbnailDetails,
      'GLOBALSEARCH'
    );
  }

  onPDFThumbnailDetails(action) {
    // If the type does not match, do not render details popup. Since we are using/creating
    // this component more than once, this function will be trigerred for all the instances
    // To avoid multiple popups, this check is put
    if (action.type != this.detailGridListEvents) {
      return;
    }
    const dialogRef = this.openModelWindow();
    const thumbnailDetails = action.cardInfo;
    const response = action.payload.model;
    const colFields = Object.keys(response[0]);
    // const detailModel = this.onPDFFormatFieldSet(response, colFields);
    const detailModel = this.onDetailColumnFormatFieldSet(response, colFields);
    this.onDisplayDetails(
      dialogRef,
      detailModel,
      colFields,
      thumbnailDetails,
      'PDFSEARCH'
    );
  }

  onDisplayDetails(
    dialogRef,
    detailModel,
    colFields,
    thumbnailDetails,
    searchType
  ) {
    const dialogCompInfo = dialogRef.content.instance;
    dialogCompInfo.setDigitalInformation = detailModel;
    dialogCompInfo.thumbnailInformation = thumbnailDetails;
    dialogCompInfo.searchType = searchType;
  }

  private onDetailColumnFormatFieldSet(fieldModelSet, fieldList) {
    // response Model transform/modification according to grid Model scheme requirement...
    let modelTemplate = [];
    fieldModelSet.forEach(eachResp => {
      const fieldSet = fieldList.map((eachField, index) => {
        // modifed date or by not specified replace it with original author...
        if (eachField.modifiedDate === '') {
          eachField.modifiedDate = eachField.createdDate || '';
        }
        if (eachField.modifiedBy === '') {
          eachField.modifiedBy = eachField.uploadedBy || '';
        }
        const value = this._searchStateService.formateDate(
          fieldList[index],
          eachResp[fieldList[index]]
        );
        return {
          property: this.onFormatField(fieldList[index]),
          value: value || ''
        };
      });
      modelTemplate = fieldSet;
    });
    return modelTemplate;
  }

  onFormatField(unFormatData) {
    const formatData = this._searchStateService.getAssetPropertyValue(
      unFormatData
    );
    return formatData;
  }

  onPropertyExists(thumbNailDetail) {
    const thumbnailDetail = {
      dateEntered: '',
      digAssetFileId: '',
      fileExtension: '',
      fileName: '',
      magazineName: '',
      thumbnail: ''
    };
    for (const key in thumbNailDetail) {
      if (thumbnailDetail.hasOwnProperty(key)) {
        thumbnailDetail[key] = thumbNailDetail[key];
      }
    }
    return thumbnailDetail;
  }

  openModelWindow() {
    const dialogRef: DialogRef = this._dialogService.open({
      title: 'Digital Asset Details',
      content: FileDetailsPopUpComponent
    });
    return dialogRef;
  }

  updatePageInformation(pageInfo) {
    this.trackPageChangeIndex = pageInfo.pageIndex;
    this.trackPageIndex = pageInfo.pageIndex;
    this.trackTotalItemSize = pageInfo.totalItems;
    this.trackTotalPageSize = pageInfo.totalPages;
    this.trackHasNext = pageInfo.hasNextPage;
    this.trackHasPrevious = pageInfo.hasPreviousPage;
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
    if (
      !isNaN(this.trackPageChangeIndex) &&
      this.trackPageChangeIndex > 0 &&
      this.trackPageChangeIndex <= this.trackTotalPageSize
    ) {
      this.onPageChange.emit(this.trackPageChangeIndex);
    }
  }

  handleError(fnName, err: any, caught) {
    this._appStateService.showLoader(false);
    const errAction = getErrorAction(err, fnName, 'jt-gridlist.component.ts');
    this._appStateService.dispatch(errAction);
    return Observable.of([]);
  }
}
