import { Component, OnInit, Input } from '@angular/core';
import { ENDPOINT } from '../../../../../utils/constants';
import { SearchStateService } from '../../../search-state.service';
import { ResponseContentType, RequestOptions } from '@angular/http';
import {
  AppStateService,
  SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT,
  SEARCH_GLOBAL_DOWNLOAD_RESULT,
  SEARCH_PDF_DOWNLOAD_MSG_RESULT,
  SEARCH_PDF_DOWNLOAD_RESULT
} from '../../../../../state/app-state.service';

@Component({
  templateUrl: './file-details-popup.component.html',
  styleUrls: ['./file-details-popup.component.scss']
})
export class FileDetailsPopUpComponent implements OnInit {
  @Input()
  public set setTabInformation(setTabList) {
    if (setTabList) {
      this.tabList = setTabList;
    }
  }
  @Input() searchType;
  @Input()
  public set setDigitalInformation(onDigitalInformation) {
    if (onDigitalInformation) {
      this.digitalInformation = onDigitalInformation;
    }
  }
  @Input()
  public set thumbnailInformation(assignThumbnailInformation) {
    if (assignThumbnailInformation) {
      this.thumbnailDetails = assignThumbnailInformation;
    }
  }
  tabList = [
    { selected: true, tabName: 'Details', prop: 'details'},
    // { selected: false, tabName: 'Extended Properties', prop: 'ext_properties'}
  ];
  colList = {
    details : [
      {
        field: 'property',
        title: 'Property',
        width: 100,
        template: (item) => {
          return `<div title="${item.property}" class="itemProperty">${item.property}</div>`;
        }
      },
      {
        field: 'value',
        title: 'Value',
        template: (item) => {
          return `<div title="${item.value}" class="itemValue">${item.value}</div>`;
        }
      },
    ],
    extProp : [
      { field: 'name', title: 'Name', width: 100 },
      { field: 'value', title: 'Value', width: 100 }
    ]
  };
  activeDigitalTab = this.tabList[0].prop;
  thumbnailDetails: any = {};
  digitalInformation: any = {};
  constructor(private _searchStateService: SearchStateService) { }

  ngOnInit() { }

  onTabSelected(tabInfo) {
    this.activeDigitalTab = tabInfo.prop;
  }

  reqFileDownload(fileDownloadInfo) {
    switch (this.searchType) {
      case 'GLOBALSEARCH' :
        this._searchStateService.downloadFileExists([fileDownloadInfo], SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT, SEARCH_GLOBAL_DOWNLOAD_RESULT);
        break;
      case 'PDFSEARCH' :
        this._searchStateService.downloadFileExists([fileDownloadInfo], SEARCH_PDF_DOWNLOAD_MSG_RESULT, SEARCH_PDF_DOWNLOAD_RESULT);
        break;
      case 'COVERSEARCH' :
        break;
    }
  }

  jobNo(jobNoInfo) {
      //TODO redirect job no component...  
  }
  reqNo(reqNoInfo) {
    // TODO redirect req no component...
  }

}
