import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { SearchStateService } from '../../../search-state.service';

let $;
@Component({
  selector: 'app-file-details-grid',
  templateUrl: './file-details-grid.component.html',
  styleUrls: ['./file-details-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDetailsGridComponent implements OnInit, AfterViewInit {
  @ViewChild('gridElm') gridElm: ElementRef;
  @Output() downLoadFileId = new EventEmitter();
  @Output() jobNoInfo = new EventEmitter();
  @Output() reqNoInfo = new EventEmitter();
  @Input()
  public set onGridId(onGridId) {
    if (onGridId) {
      this.gridId = onGridId;
    }
  }
  @Input()
  public set onDigitalColumn(colConfig) {
    if (colConfig) {
      this.setConfigCol = colConfig;
    }
  }
  @Input()
  public set onDigitalInformation(digitalInfo) {
    if (digitalInfo) {
      this.setDigitalInfo = digitalInfo;
    }
  }
  gridId: string;
  setDigitalInfo;
  setConfigCol = [];
  gridRef;
  constructor(private _searchStateService: SearchStateService) {
    $ = window['jQuery'];
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.gridRef) {
      this.onGenerateGrid();
      this.manpulateDOM();
    }
  }

  manpulateDOM() {
    this.gridElm.nativeElement.style.height = '40rem';
    this.gridElm.nativeElement.style.width = '50rem';
  }

  onGenerateGrid() {
    $('#' + this.gridId).kendoGrid({
      dataSource: { data: [] },
      noRecords: true,
      excel: {
        allPages: true,
        fileName: 'Global-Search.xlsx'
      },
      selectable: 'multiple,row',
      excelExport: this.onGenerateExcel.bind(this),
      scrollable: true,
      sort: this.onSortRequest.bind(this),
      resizable: true,
      filterable: false,
      sortable: true,
      columns: this.setConfigCol,
      dataBinding: this.onInitGrid.bind(this),
      dataBound: this.onGenerateFileLink.bind(this),
      change: this.onGridSelected.bind(this)
    });
    this.gridRef = $('#' + this.gridId).data('kendoGrid');
    this.renderGrid();
  }

  onGenerateExcel() { }

  onSortRequest() { }

  onInitGrid(e: any) {
    if (e.sender && e.sender.element.find('.itemValue')) {
      const elmLen = e.sender.element.find('.itemValue').length;
      if (elmLen > 0) {
        this.generateLinkEle(e.sender.element.find('.itemValue')[3]);
        this.textFileCustomize(e.sender.element.find('.itemValue')[14]);
      }
    }
  }

  onGenerateFileLink(e: any) {
    this.hideDigitalAssetsInformation();
    e.sender.element.find('.itemValue').bind('click', (event) => {
      const gridRef = $('#' + this.gridId).data('kendoGrid');
      const rowRef = gridRef.dataItem($(event.target).closest('tr'));
      const rowIndex = $(event.target).closest('tr').index();
      if (rowRef && rowRef.property.toUpperCase().trim() === 'FILE NAME'.trim()) {
        this.startDownload(gridRef.dataSource._data);
        // const filePath = gridRef.dataSource._data[6].value + '\\' + gridRef.dataSource._data[7].value + '\\' + gridRef.dataSource._data[3].value;
        // const fileId = gridRef.dataSource._data[0].value;
        // this.downLoadFileId.emit({key: fileId, value: filePath});
      }
      if (rowRef && rowRef.property.toUpperCase().trim() === 'JOB NUMBER'.trim()) {
        const jobNoId = gridRef.dataSource._data[15].value;
        this.jobNoInfo.emit(jobNoId);
      }
      if (rowRef && rowRef.property.toUpperCase().trim() === 'REQUEST NUMBER'.trim()) {
        const reqNoId = gridRef.dataSource._data[16].value;
        this.reqNoInfo.emit(reqNoId);
      }
    });
    const elmLen = e.sender.element.find('.itemValue').length;
    if (elmLen > 0) {
      this.generateLinkEle(e.sender.element.find('.itemValue')[3]); // gets file Id
      this.generateLinkEle(e.sender.element.find('.itemValue')[15]); // gets job No
      this.generateLinkEle(e.sender.element.find('.itemValue')[16]); // gets job req
      this.textFileCustomize(e.sender.element.find('.itemValue')[14]); // text content
    }
  }

  hideDigitalAssetsInformation() {
    this.gridRef = $('#' + this.gridId).data('kendoGrid');
    this.gridRef.table.find('tr:first').hide();
  }

  generateLinkEle(element) {
    const innerContent = element.innerHTML;
    if (element && element.innerHTML) {
      element.innerHTML = '';
      const anchorElm = <HTMLAnchorElement>document.createElement('a');
      anchorElm.href = 'javascript:void(0)';
      anchorElm.className = 'downLoadedLink';
      anchorElm.style.color = 'lightblue';
      anchorElm.innerHTML = innerContent;
      element.appendChild(anchorElm);
    }
  }

  textFileCustomize(element) {
    if (element) {
      element.style.height = '4rem';
      element.style.overflowY = 'scroll';
      element.style.whiteSpace = 'normal';
    }
  }

  onGridSelected() {
    const selectedRowElement = this.gridRef.tbody.find('tr[data-uid="' + this.gridRef.dataItem(this.gridRef.select()).uid + '"]');
    this.onSelectedRow(selectedRowElement);
  }

  onSelectedRow(selRowElm) {
    selRowElm.removeClass('k-state-selected');
  }

  setDataSource(dataSourceInformation) {
    if (this.gridRef && dataSourceInformation) {
      this.gridRef.dataSource.data(dataSourceInformation);
      this.gridRef.dataSource.fetch();
    }
  }

  downloadFile() {
    // const filePath = this.setDigitalInfo[6].value + '\\' + this.setDigitalInfo[7].value + '\\' + this.setDigitalInfo[3].value;
    // const fileId = this.setDigitalInfo[0].value;
    // this.downLoadFileId.emit({ value: filePath, key: fileId});
    this.startDownload(this.setDigitalInfo);
  }

  startDownload(fileInfo) {
    const filePath = fileInfo[6].value + '\\' + fileInfo[7].value + '\\' + fileInfo[3].value;
    const fileId = fileInfo[0].value;
    this.downLoadFileId.emit({ value: filePath, key: fileId});
  }

  renderGrid() {
    this.setDataSource(this.setDigitalInfo);
  }
}
