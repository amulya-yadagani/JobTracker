import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SEARCH_GLOBAL_FILEID, SEARCH_GLOBAL_DOWNLOAD } from '../../../../utils/constants';
import { removeFileExt } from '../../../../utils/utils';
import { GlobalSearchService } from '../global-search.service';
import { SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT } from '../../../../state/app-state.service';

let $;
let kendo;
@Component({
  selector: 'app-global-grid-list',
  templateUrl: './global-grid-list.component.html',
  styleUrls: ['./global-grid-list.component.scss']
})
export class GlobalGridListComponent implements OnInit {
  @Output() onResultAction = new EventEmitter();
  @Output() onGridListChange = new EventEmitter();
  @Output() onPageChanges = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();
  @Output() onDownloadSelect = new EventEmitter();
  @Input()
  public set globalGridSearched(searched) {
    if (searched) {
      this.searched = (searched === 'show') ? true : false;
    }
  }
  @Input()
  public set resultInfo(onResultRecieved) {
    if (onResultRecieved) {
      this.onResultRecieved = onResultRecieved;
    }
  }
  @Input()
  public set resultActionInfo(setResultActionInfo) {
    if (setResultActionInfo) {
      this.resultAction = setResultActionInfo;
    }
  }
  @Input()
  public set pageSearchInfo(setSearchedPageInfo) {
    if (setSearchedPageInfo) {
      this.pageInformation = setSearchedPageInfo;
      this.searched = this.pageInformation.searched;
    }
  }
  detailEventsGridList = SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT || '';
  isExportTriggered: boolean;
  pageInformation;
  detailsURL = SEARCH_GLOBAL_FILEID;
  downloadURL = SEARCH_GLOBAL_DOWNLOAD;
  onResultRecieved = [];
  searchParams;
  searched = true;
  resultAction;
  gridColumn =  [
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
  constructor(
    private _globalSearchService: GlobalSearchService
  ) {
    $ = window['jQuery'];
    kendo = window['kendo'];
  }

  ngOnInit() {  }

  onSetResultAction(onResultActionChange) {
    if (onResultActionChange && onResultActionChange.selAction === 'EXPORT') {
      this.isExportTriggered = true;
    }
    this.onResultAction.emit(onResultActionChange);
  }

  onGridListActionUpdate(updatedInfo) {
    this._globalSearchService.patchResultModel(updatedInfo, updatedInfo.digAssetFileId);
    const selectedType = this.validateResultModelSelected();
    const resultActions = this._globalSearchService.getResultActionModel('list');
    this.onGridListChange.emit({
      triggeredBy: 'RowCheck',
      selAction: selectedType,
      resultActions: resultActions,
      type: 'list',
      tabType: 'global'
    });
  }

  validateResultModelSelected() {
    const resultList = (this._globalSearchService.getResultModel() as any).itemSource;
    let allSelected = false;
    let noneSelected = false;
    let selectionType;
    resultList.forEach((onEachResult) => {
      if (onEachResult.selected) {
        allSelected = true;
      }
      if (!onEachResult.selected || onEachResult.selected === undefined) {
        noneSelected = true;
      }
      return (onEachResult.selected === undefined || !onEachResult.selected);
    });
    if (allSelected && noneSelected) {
      selectionType = 'PARTIALSELECT'; // some checkbox are selected by the user.
    }else if (allSelected && !noneSelected) {
      selectionType = 'SELECTALL'; // all checkbox are selected by the user.
    } else if (!allSelected && noneSelected) {
      selectionType = 'CLEARALL';  // none selected by the user.
    }
    return selectionType;
  }

  onPageChangeAction(onPageChanges) { 
    this.onPageChanges.emit(onPageChanges);
  }
  onPageSizeChangeAction(onPageSizeChanges) {
    this.onPageSizeChange.emit(onPageSizeChanges);
  }

  onDownLoadAction(downloadFile) {
    this.onDownloadSelect.emit([downloadFile]);
  }
}
