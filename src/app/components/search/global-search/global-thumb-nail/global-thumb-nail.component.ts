import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppStateService, SEARCH_GLOBAL_THUMBNAIL, SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT, SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT } from '../../../../state/app-state.service';
import { GlobalSearchService } from '../global-search.service';
import { SEARCH_GLOBAL_FILEID, SEARCH_GLOBAL_DOWNLOAD } from '../../../../utils/constants';

@Component({
  selector: 'app-global-thumb-nail',
  templateUrl: './global-thumb-nail.component.html',
  styleUrls: ['./global-thumb-nail.component.scss']
})
export class GlobalThumbNailComponent implements OnInit {
  @Output() onPageChanges = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();
  @Output() onThumbNailChange = new EventEmitter();
  @Output() onResultAction = new EventEmitter();
  @Input()
  public set resultInfo(setResultInfo) {
    if (setResultInfo) {
      this.onResultRecieved = setResultInfo;
    }
  }
  @Input()
  public set pageSearchInfo(setSearchedPageInfo) {
    if (setSearchedPageInfo) {
      this.pageInformation = setSearchedPageInfo;
      this.searched = this.pageInformation.searched;
    }
  }
  @Input()
  public set resultActionInfo(setResultActionInfo) {
    if (setResultActionInfo) {
      this.resultAction = setResultActionInfo;
    }
  }
  detailEventsThumbnail = SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT || '';
  detailsURL = SEARCH_GLOBAL_FILEID || '';
  downloadURL = SEARCH_GLOBAL_DOWNLOAD || '';
  searched: boolean = false;
  pageInformation;
  resultAction;
  onResultRecieved = [];
  searchParams = null;
  constructor(
    private _appStateService: AppStateService,
    private _globalSearchService: GlobalSearchService
  ) {
    this._appStateService.subscribe(SEARCH_GLOBAL_THUMBNAIL, this.onSearchAction.bind(this));
  }

  ngOnInit() { }

  onSetResultAction(onResultActionChange) {
    this.onResultAction.emit(onResultActionChange);
  }

  onSearchAction(searchAction) {
    this.searchParams = searchAction.payload.data;
  }

  onThumbNailActionUpdate(updatedInfo) {
    this._globalSearchService.patchResultModel(updatedInfo, updatedInfo.digAssetFileId);
    //TODO validate all selected, single selected & files types validation
    const selectedType = this.validateResultModelSelected();
    const resultActions = this._globalSearchService.getResultActionModel('thumbnail');
    this.onThumbNailChange.emit({
      triggeredBy: 'CheckBox',
      selAction: selectedType,
      resultActions: resultActions,
      type: 'thumbnail',
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
}
