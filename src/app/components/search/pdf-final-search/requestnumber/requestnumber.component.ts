import { Component, OnInit, Input, AfterViewInit, AfterViewChecked, ViewEncapsulation } from '@angular/core';

let $;
@Component({
  selector: 'app-requestnumber',
  templateUrl: './requestnumber.component.html',
  styleUrls: ['./requestnumber.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestNumberPopUpComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() gridId;
  @Input() set requestInfo(gridDataSource) {
    if (gridDataSource) {
      this.gridDataSource = gridDataSource;
    }
  };
  private gridRef;
  private gridDataSource = [];
  private requestColumn = [
    {
      field: 'requestNumber', title: 'Request Number',
      template: (item) => {
        return item.requestNumber;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'title', title: 'Job Title',
      template: (item) => {
        return item.title;
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    },
    {
      field: 'submittedDate', title: 'Submitted Date',
      template: (item) => {
        return new Date(item.submittedDate).toLocaleString();
      },
      width: 100,
      filterable: { extra: true, multi: true, search: true }
    }
  ];

  constructor() {
    $ = window['jQuery'];
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.gridDataSource && this.gridDataSource.length > 0) {
      if (!this.gridRef) {
        this.generateRequestGrid();
        this.gridRef = $('#' + this.gridId).data('kendoGrid');
      }
      if (this.gridRef) {
        this.gridRef.dataSource.data(this.gridDataSource);
        this.gridRef.dataSource.fetch();
      }
    }
  }

  ngAfterViewChecked() { }

  private generateRequestGrid() {
    $('#' + this.gridId).kendoGrid({
      dataSource: { data: [] },
      noRecords: true,
      excel: {
        allPages: true,
        fileName: 'request-number.xlsx'
      },
      selectable: 'multiple,row',
      //excelExport: this.onGenerateExcel.bind(this),
      scrollable: true,
      sort: this.onSortRequest.bind(this),
      resizable: true,
      filterable: false,
      sortable: true,
      columns: this.requestColumn,
      // dataBound: this.onGenerateFileLink.bind(this),
      // change: this.onGridSelected.bind(this)
    });
  }

  private onSortRequest() { }

}
