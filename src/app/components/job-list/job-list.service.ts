import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppStateService, MY_JOB_LIST, MY_JOB_LIST_RESULT, MY_JOB_LIST_COLUMN_DATA, MY_JOB_LIST_COLUMN_DATA_RESULT } from "../../state/app-state.service";
import { MY_TODO_LIST_URL, MY_TODO_LIST_FILTER_COLUMN_URL } from "../../utils/constants"
import { getErrorAction, formatJobListDates } from "../../utils/utils";

@Injectable()
export class JobListService {
    constructor(private http: Http, private stateService: AppStateService) {
        stateService.subscribe(MY_JOB_LIST, this.getJobList.bind(this));
        stateService.subscribe(MY_JOB_LIST_COLUMN_DATA, this.getColumnList.bind(this));
    }

    getJobList(action) {
        this.stateService.showLoader(true);
        this.http.post(MY_TODO_LIST_URL+action.jobListType, action.request)
            .map((res: Response) => { const result = res.json(); return result; })
            .catch(this.handleError.bind(this, 'getJobList()'))
            .subscribe((result) => {
                let res;
                if (result) {
                    res = result.model ? result.model : this.factoryResponse();

                    formatJobListDates(res.itemSource);
                } else {
                    res = 0;
                }
                this.stateService.dispatch({
                    type: MY_JOB_LIST_RESULT,
                    result: res,
                    jobListType: action.jobListType
                })
                this.stateService.showLoader(false);
            });
    }

    factoryResponse() {
      return {
        pageIndex: 0,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        itemSource: []
      }
    }

    getColumnList(action) {
        this.stateService.showLoader(true);
        this.http.get(MY_TODO_LIST_FILTER_COLUMN_URL + "columnName=" + action.column + "&jobListType=" +action.jobListType, action.column)
            .map((res: Response) => { const result = res.json(); return result; })
            .catch(this.handleError.bind(this, 'getColumnList()'))
            .subscribe((result) => {
                if (result.model.length) {
                    this.stateService.dispatch({
                        type: MY_JOB_LIST_COLUMN_DATA_RESULT,
                        result: result.model,
                        event: action.event,
                        jobListType: action.jobListType
                    });
                this.stateService.showLoader(false);
                }
            })
    }

    handleError(fnName, err: any, caught): any {
        console.log(`MyTodoListService Status: ${err.status} Message: ${err.statusText}`);
        const errAction = getErrorAction(err, fnName, "my-todo-list.service.ts");
        this.stateService.dispatch(errAction);
        this.stateService.showLoader(false);

        this.stateService.showNotification(err,null);
        //Return observable that emits empty array. This will call fn passed to subscribe() with value as []
        return Observable.of([]);
    }
}
