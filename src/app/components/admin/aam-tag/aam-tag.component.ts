import { Component, OnInit } from "@angular/core";
import '@progress/kendo-ui/js/kendo.grid.js';
import { data as kdata } from '@progress/kendo-ui/js/kendo.core.js';

let $ = null;

@Component({
  selector: 'aam-tag',
  templateUrl: './aam-tag.component.html'
})
export class AAMTagComponent implements OnInit {

  constructor() {
    $ = window['jQuery'];
  }

  ngOnInit() {
    this.initGrid();
  }

  initGrid() {
    /* let data = {
      sortingOrder: 1,
      sortColumn: "",
      filterParam: [
        {
          columnName: "requestNumber",
          filterValue: "",
          filterOption: 1
        }
      ],
      pageNumber: 0,
      pageSize: 0
    }

    let remoteDataSource = new kdata.DataSource({
      transport: {
        read: {
          url: "http://tmpcmamva04/JobTrackerApi/api/JobList/Jobs",
          dataType: "json",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          data: data
        },
        parameterMap: (data, type) => JSON.stringify(data)
      }
    });

    let gridConfig = {
      data: remoteDataSource
    }

    $("#grid").kendoGrid(gridConfig);
    remoteDataSource.read(); */
  }
}
