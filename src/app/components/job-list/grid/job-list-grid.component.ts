import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { data as kdata } from "@progress/kendo-ui/js/kendo.core.js";
import '@progress/kendo-ui/js/kendo.listview.js';

import { AppStateService, MY_JOB_LIST, MY_JOB_LIST_RESULT, MY_JOB_LIST_COLUMN_DATA, MY_JOB_LIST_COLUMN_DATA_RESULT, OPEN_JOB_REQUEST } from "../../../state/app-state.service";
import { FILTER_MAP, SORT_ORDER_MAP, RESET_CONFIRM } from "../../../utils/constants"
import { DialogService } from '@progress/kendo-angular-dialog';

let $ = null;

@Component({
    selector: "job-list-grid",
    templateUrl: "./job-list-grid.component.html",
    styleUrls: ["./job-list-grid.component.scss"]
})
export class JobListGridComponent implements OnInit {

    @Input() gridId;
    @Input() model;
    @Input() columns;
    @Input() jobListType;
    items;
    reqParamModified;
    reqParam = {
        sortingParams: [],
        filterParam: [],
        groupingColumns: [],
        pageNumber: 1,
        pageSize: 25
    };
    columnData;
    pageSize = 25;
    pageIndex = 1;
    totalPages = 0;
    totalItems = 0;
    hasPreviousPage;
    hasNextPage;
    filters = [];
    fieldFilters = [];
    groups = [];
    sort = [];
    checkboxElement;
    /**
     * Since server side filtering is managed by us and not kendo grid,
     * we are not setting the applied filters using dataSource.filter() since it triggers
     * unnecessary filtering
     * This map maintains the filter icon state (active/inactive)
     * key is column field and value is {
     *    anchor, -> element that displays filter icon
     *    applied, -> icon's state (true/false)
     *    operatorFilter: {
     *      operator,
     *      value
     *    }
     * }
     *
     * operatorFilter holds manually entered filter which is used to populate the values
     * back when filter popup is opened
     */
    fieldFilterMap: any = {};
    shiftKeyDownForSort = false;

    constructor(private stateService: AppStateService, private router: Router, private dialogService: DialogService) {
        stateService.subscribe(MY_JOB_LIST_RESULT, this.getMyTodoList.bind(this));
        stateService.subscribe(MY_JOB_LIST_COLUMN_DATA_RESULT, this.getMyTodoColumnResult.bind(this));
        $ = window['jQuery'];
    }

    getMyTodoColumnResult(action) {
        if (action.jobListType != this.jobListType) {
            return;
        }

        this.columnData = action.result;
        this.initCheckboxFilter(action.event);
    }

    getMyTodoList(action) {
        if (action.jobListType != this.jobListType) {
            return;
        }

        let grid = $("#gridId").data("kendoGrid");
        if (grid && action.result && action.result.itemSource) {
            this.pageIndex = action.result.pageIndex;
            this.totalItems = action.result.totalItems;
            this.totalPages = action.result.totalPages;
            this.hasPreviousPage = action.result.hasPreviousPage;
            this.hasNextPage = action.result.hasNextPage;
            grid.dataSource.data(action.result.itemSource)
            grid.dataSource.pageSize(this.pageSize)
            //grid.dataSource.filter(this.filters)
            grid.dataSource.group(this.groups)
            grid.dataSource.sort(this.sort)

            let keys = Object.keys(this.fieldFilterMap);
            keys.forEach(key => this.toggleFilterState(key));
        }
    }

    previous(pageIndex, totalPages) {
        if (pageIndex != 0) {
            this.pageIndex = --pageIndex;
            this.reqParam.pageNumber = this.pageIndex;
            this.reqParam.pageSize = this.pageSize
            let req = this.reqParam;
            this.reqParamModified = true;
            this.stateService.dispatch({
                type: MY_JOB_LIST,
                request: req,
                jobListType: this.jobListType
            })
        }
    }

    next(pageIndex, totalPages) {
        if (pageIndex < totalPages) {
            this.pageIndex = ++pageIndex;
            this.reqParam.pageNumber = this.pageIndex;
            this.reqParam.pageSize = this.pageSize
            let req = this.reqParam;
            this.reqParamModified = true;
            this.stateService.dispatch({
                type: MY_JOB_LIST,
                request: req,
                jobListType: this.jobListType
            })
        }
    }

    moveToFirstPage(pageIndex, totalPages) {
        if (pageIndex !== 0) {
            this.pageIndex = 1;
            this.reqParam.pageNumber = this.pageIndex;
            this.reqParam.pageSize = this.pageSize
            let req = this.reqParam;
            this.reqParamModified = true;
            this.stateService.dispatch({
                type: MY_JOB_LIST,
                request: req,
                jobListType: this.jobListType
            })
        }
    }

    moveToLastPage(pageIndex, totalPages) {
        if (pageIndex < totalPages) {
            this.pageIndex = totalPages;
            this.reqParam.pageNumber = this.pageIndex;
            this.reqParam.pageSize = this.pageSize
            let req = this.reqParam;
            this.reqParamModified = true;
            this.stateService.dispatch({
                type: MY_JOB_LIST,
                request: req,
                jobListType: this.jobListType
            })
        }
    }

    onPageSizeChange(pageSize) {
        this.reqParam.pageNumber = 1;
        this.reqParam.pageSize = pageSize
        let req = this.reqParam;
        this.reqParamModified = true;
        this.stateService.dispatch({
            type: MY_JOB_LIST,
            request: req,
            jobListType: this.jobListType
        })
    }

    onPageIndexChange(textIp) {
        let value = parseInt(textIp.value);

        if (value && !isNaN(value) && value != this.pageIndex && value <= this.totalPages) {
            this.reqParam.pageNumber = value;
            this.reqParamModified = true;
            this.stateService.dispatch({
                type: MY_JOB_LIST,
                request: this.reqParam,
                jobListType: this.jobListType
            })
        }
        else {
            textIp.value = this.pageIndex;
        }
    }

    onResetConfirm() {
        const self = this;
        let dialog = this.dialogService.open({
            title: "Confirm",
            content: RESET_CONFIRM,
            actions: [
                { text: "Yes" },
                { text: "No", primary: true }
            ]
        });

        dialog.result.subscribe(result => {
            if (result["text"] == "Yes") {
                self.resetFilter();
            }
        })
    }

    resetFilter() {
        const self = this;
        this.reqParam.pageNumber = 1;
        this.reqParam.pageSize = this.pageSize;
        this.reqParam.filterParam = [];
        this.reqParam.groupingColumns = [];
        this.reqParam.sortingParams = [];
        this.filters = [];
        this.groups = [];
        this.sort = [];
        this.shiftKeyDownForSort = false;

        let grid = $("#gridId").data("kendoGrid");
        if (grid) {
            this.resetColumns(grid);
            let colHeaders = grid.thead.find('tr th');
            if (colHeaders.length > 0) {
                //Reset filters for each column if already instantiated
                colHeaders.each((idx, header) => {
                    let filterMenu = $(header).data("kendoFilterMenu");
                    if (filterMenu && filterMenu.form) {
                        filterMenu.form.trigger('reset');
                    }
                })
            }
        }

        //Reset filter icon state and manual enrty filter
        let keys = Object.keys(this.fieldFilterMap);
        keys.forEach(this.resetFieldFilterMap.bind(this));
        this.reqParamModified = false;
        this.stateService.dispatch({
            type: MY_JOB_LIST,
            request: this.reqParam,
            jobListType: this.jobListType
        });
    }

    resetColumns(grid) {
        for (var i = 0; i < grid.options.columns.length; i++) {
            var field = grid.options.columns[i].field;
            for (var j = 0; j < grid.columns.length; j++) {
                if (grid.columns[j].field == field) {
                    grid.reorderColumn(i, grid.columns[j]);
                }
            }
        }
    }

    initCheckboxFilter(e) {
        let that = this;
        var grid = $("#gridId").data("kendoGrid");
        if (grid) {
            var popup = e.container.data("kendoPopup");
            var field = e.field;
            var dataSource = grid.dataSource;
            var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
            var textBox = e.container.find("input.k-textbox:eq(0)");
            var numTextBox = e.container.find("input[data-role='numerictextbox']:eq(0)");
            var dateBox = e.container.find("input[data-role='datepicker']:eq(0)").data("kendoDatePicker");
            let radioBtns = e.container.find("input[type='radio']");
            let element = null;
            /**
             * This flag is used to fix following issue
             * 1) Open JT2.0 Application.
             * 2) MY-TO-DO-List->click on any column filter-> select data and click Filter.
             * 3) Click again on same column filter and uncheck all the selection and click Filter.
             * 4) Click again on filter and click Clear. The filter is not cleared
             * Clicking on Clear should make a call. This issue happens when filter is applied to only one field/column
             */
            let allowRequestOnClear = false;

            that.fieldFilterMap[field] = {
                anchor: that.getFilterAnchor(field),
                applied: false,
                operatorFilter: {}
            }

            if (field != "rush") {
                var checkboxesDataSource = new kdata.DataSource({
                    data: this.uniqueForField(this.columnData, e.field, dateBox)
                });
                var helpTextElement = e.container.children(":first").children(":first");
                element = $("<div class='checkbox-container'></div>").insertAfter(helpTextElement).kendoListView({
                    dataSource: checkboxesDataSource,
                    template: "<div><input type='checkbox' class='' value='#:" + field + "#'/>&nbsp;#:" + field + "#</div>"
                });
            }

            e.container.find("[type='submit']").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var filter = dataSource.filter() || { logic: "and", filters: [] };
                var fieldFilters = [];
                if (element) {
                    fieldFilters = $.map(element.find(":checkbox:checked"), function (input) {
                        return {
                            field: field,
                            operator: "eq",
                            value: input.value
                        };
                    });
                }
                let operator = firstValueDropDown ? firstValueDropDown.value() : "eq";
                let manualFilter = null;
                if (textBox.val()) {
                    manualFilter = { field: field, operator: operator, value: textBox.val() };
                } else if (numTextBox.val()) {
                    manualFilter = { field: field, operator: operator, value: numTextBox.val() };
                } else if (dateBox && dateBox.value()) {
                    manualFilter = { field: field, operator: operator, value: dateBox.value().toLocaleDateString() };
                }
                //Make a call for these two operators
                else if (operator == "isempty" || operator == "isnotempty") {
                    manualFilter = { field: field, operator: operator, value: "" };
                }
                else if (radioBtns.length > 0) {//For type boolean
                    let btn = radioBtns.filter((idx, el) => el.checked);
                    if (btn.length) {
                        manualFilter = { field: field, operator: "eq", value: btn.val() == "true" ? true : false };
                    }
                }

                //Clear any earlier entered value
                that.resetFieldFilterMap(field);

                if (manualFilter) {
                    fieldFilters.splice(0, 0, manualFilter);
                    that.fieldFilterMap[field].operatorFilter = manualFilter;
                }

                if (!allowRequestOnClear)//If already set then do not overwrite
                    allowRequestOnClear = fieldFilters.length == 0 && that.fieldHasFilters(field);
                //Remove previously set filters for the column
                that.removeFiltersForFieldInReq(field);
                that.fieldFilterMap[field].applied = false;

                if (fieldFilters.length) {
                    let filterArray: any = {};

                    that.removeFiltersForField(filter, field);
                    filter.filters.push({
                        logic: "or",
                        filters: fieldFilters
                    });
                    that.filters = filter;
                    fieldFilters.forEach(i => {
                        filterArray.columnName = i.field;
                        filterArray.filterValue = i.value;
                        filterArray.filterOption = FILTER_MAP[i.operator];
                        that.reqParam.filterParam.push(filterArray);
                        filterArray = {};
                    })
                    that.reqParam.pageNumber = 1;
                    that.reqParam.pageSize = that.pageSize;

                    that.fieldFilterMap[field].applied = true;
                }
                //If filter is applied then make a request
                if (that.reqParam.filterParam.length) {
                    that.reqParamModified = true;
                    that.stateService.dispatch({
                        type: MY_JOB_LIST,
                        request: that.reqParam,
                        jobListType: that.jobListType
                    });
                }
                popup.close();
            });

            e.container.find("[type='reset']").click(function (e) {
                if (that.filters.length || that.reqParam.filterParam.length || allowRequestOnClear) {
                    let delIndex;
                    that.reqParam.pageNumber = 1;
                    that.reqParam.pageSize = that.pageSize;
                    that.resetFieldFilterMap(field);
                    that.removeFiltersForFieldInReq(field);
                    that.removeFiltersForField(that.filters, field);
                    allowRequestOnClear = false;
                    that.stateService.dispatch({
                        type: MY_JOB_LIST,
                        request: that.reqParam,
                        jobListType: that.jobListType
                    })
                }
            });

        }
    }

    removeFiltersForField(expression, field) {
        let that = this;
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                that.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    removeFiltersForFieldInReq(field) {
        for (let i = this.reqParam.filterParam.length - 1; i >= 0; i--) {
            if (this.reqParam.filterParam[i].columnName == field) {
                this.reqParam.filterParam.splice(i, 1);
            }
        }
    }

    fieldHasFilters(field) {
        return this.reqParam.filterParam.some(item => item.columnName == field);
    }

    uniqueForField(data, field, dateBox) {
        var map = {};
        var result = [];
        data.forEach((i, index) => {
            if (dateBox) {
                data[index] = data[index] ? new Date(data[index]).toLocaleDateString() : "";
            }
            map[field] = data[index];
            result.push(map);
            map = {};
        })
        return result;
    }

    getFilterAnchor(field) {
        let grid = $("#gridId").data("kendoGrid");
        let anchor = null;

        if (grid) {
            let $a = grid.thead.find(`tr th[data-field="${field}"] > a.k-grid-filter`);
            if ($a.length) {
                anchor = $a[0];
            }
        }

        return anchor;
    }

    toggleFilterState(field) {
        if (field in this.fieldFilterMap) {
            let { anchor, applied } = this.fieldFilterMap[field];
            $(anchor).toggleClass('k-state-active', applied);
        }
    }

    resetFieldFilterMap(field) {
        if (field) {
            //Reset filter icon state and manual enrty filter
            this.fieldFilterMap[field].applied = false;
            this.fieldFilterMap[field].operatorFilter = {};
        }
    }

    ngOnInit() {
        let that = this;
        this.reqParam.pageNumber = this.pageIndex;
        this.reqParam.pageSize = this.pageSize

        this.stateService.dispatch({
            type: MY_JOB_LIST,
            request: this.reqParam,
            jobListType: this.jobListType
        })

        $("#gridId").kendoGrid({
            resizable: true,
            sortable: {
                mode: "multiple"
            },
            reorderable: true,
            noRecords: true,
            scrollable: true,
            filterable: {
                operators: {
                    date: {
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gte: "Is greater than or equal to",
                        gt: "Is greater than",
                        lte: "Is less than or equal to",
                        lt: "Is less than",
                        isempty: "Is empty",
                        isnotempty: "Is not empty"
                    },
                    string: {
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        startswith: "Starts with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        endswith: "Ends with",
                        isempty: "Is empty",
                        isnotempty: "Is not empty"
                    },
                    number: {
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gte: "Is greater than or equal to",
                        gt: "Is greater than",
                        lte: "Is less than or equal to",
                        lt: "Is less than",
                        isempty: "Is empty",
                        isnotempty: "Is not empty"
                    }
                },
                extra: false
            },
            filterMenuInit: function (e) {
                let event = {};
                event['container'] = e.container
                event['field'] = e.field
                event['dataSource'] = this.dataSource
                if (e.field != "rush") {
                    that.stateService.dispatch({
                        type: MY_JOB_LIST_COLUMN_DATA,
                        column: e.field,
                        event: event,
                        jobListType: that.jobListType
                    })
                }
                else {//For boolean data type, do not make a server call
                    that.initCheckboxFilter(event);
                }
            },
            filterMenuOpen: function (e) {
                if (e.field in that.fieldFilterMap) {
                    let filter = that.fieldFilterMap[e.field];
                    let dropDown = e.container.find("select:eq(0)").data("kendoDropDownList");

                    if (dropDown) {
                        dropDown.value(filter.operatorFilter.operator);
                    }

                    let textbox = e.container.find("input.k-textbox");
                    let formattedNumericBox = e.container.find("input.k-formatted-value");
                    //Set value for hidden input for the filter to work correctly
                    let numericBox = e.container.find("input[data-role='numerictextbox']");
                    let datebox = e.container.find("input[data-role='datepicker']:eq(0)").data("kendoDatePicker");
                    let radioBtns = e.container.find("input[type='radio']");

                    if (textbox.length) {
                        textbox.val(filter.operatorFilter.value);
                    }
                    else if (numericBox.length) {
                        numericBox.val(filter.operatorFilter.value);
                        formattedNumericBox.val(filter.operatorFilter.value);
                    }
                    else if (datebox) {
                        datebox.value(filter.operatorFilter.value)
                    }
                    else if (radioBtns && filter.operatorFilter.value != undefined) {
                        let btn = e.container.find(`input[value='${filter.operatorFilter.value}']`);
                        if (btn) {
                            btn.prop('checked', filter.operatorFilter.value);
                        }
                    }
                }
            },
            groupable: true,
            columns: that.columns,
            dataSource: {
                schema: {
                    model: that.model
                }
            },
            group: function gridGrouping(e) {
                let grid = $("#gridId").data("kendoGrid");
                that.groups = [];
                let grpColumns = [];
                e.preventDefault();
                if (e.groups.length == 0) {
                    that.reqParam.groupingColumns = [];
                    grid.dataSource.group([]);
                } else {
                    e.groups.forEach(i => {
                        grpColumns.push(i.field);
                        that.groups.push({ field: i.field });
                    });
                    that.reqParam.groupingColumns = grpColumns;
                    that.reqParamModified = true;
                    that.stateService.dispatch({
                        type: MY_JOB_LIST,
                        request: that.reqParam,
                        jobListType: that.jobListType
                    });
                }
            },
            sort: function (e) {
                e.preventDefault();
                that.reqParam["pageNumber"] = 1;
                that.reqParam["pageSize"] = that.pageSize;

                if (!that.shiftKeyDownForSort) {
                    that.sort = [];
                }

                if (e.sort.dir == undefined) {
                    for (let i = that.sort.length - 1; i >= 0; i--) {
                        if (that.sort[i].field == e.sort.field) {
                            that.sort.splice(i, 1);
                        }
                    }
                }
                else {
                    let col = that.sort.filter(item => item.field == e.sort.field);
                    if (col.length) {
                        col[0].dir = e.sort.dir;
                    }
                    else if (that.sort.length == 0 || that.shiftKeyDownForSort) {
                        that.sort.push(e.sort);
                    }
                }

                that.reqParam.sortingParams = that.getSortParams();
                that.reqParamModified = true;
                that.stateService.dispatch({
                    type: MY_JOB_LIST,
                    request: that.reqParam,
                    jobListType: that.jobListType
                });
            },
            columnReorder: function (e) {
                that.reqParamModified = true;
            }
        });

        let grid = $("#gridId").data("kendoGrid");
        grid.content.on('click', this.onLinkClick.bind(this));

        grid.thead.find('a.k-link').on('click', this.onColumnHeaderClick.bind(this));
    }

    getSortParams() {
        return this.sort.map(item => ({
            sortOrder: SORT_ORDER_MAP[item.dir],
            columnName: item.field
        }))
    }

    onLinkClick(e) {
        if (e && e.target.tagName == "A") {
            let grid = $("#gridId").data("kendoGrid");
            let $tr = $(e.target).closest("tr");
            let field = e.target.dataset.column;
            let uid = $tr.data("uid");
            let di = grid.dataSource.getByUid(uid);

            this.router.navigateByUrl("/job-request").then(() => {
                let title = di.jobNumber ? di.jobNumber : `Request ${di.requestNumber}`;
                this.stateService.dispatch({
                    type: OPEN_JOB_REQUEST,
                    payload: {
                        jobInfo: di,
                        title: title,
                        closeable: true
                    }
                })
            });
        }
    }

    onColumnHeaderClick(e) {
        //If shiftkey is pressed, then user wants multiple sort
        if (e && e.target.classList.contains("k-link")) {
            this.shiftKeyDownForSort = e.shiftKey;
        }
    }
}
