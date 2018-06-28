import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';

import { AppStateService, RECENT_JOB_LIST, RECENT_JOB_LIST_RESULT } from "./state/app-state.service";
import { USER_RECENT_JOBS } from "./utils/constants";
import { getErrorAction } from "./utils/utils";


@Injectable()
export class AppService {

  constructor(private appStateService: AppStateService, private http: Http) {
    this.appStateService.subscribe(RECENT_JOB_LIST, this.getRecentJobs.bind(this));
  }

  getRecentJobs(action) {
    let url = `${USER_RECENT_JOBS}?TeamMemberId=${this.appStateService.userInfo.teamMemberId}`;
    let result$ = this.http.get(url,this.appStateService.noChacheHeaders)
                      .map(res => {
                        const result = res.json();
                        return result.model;
                      })
                      .catch(this.handleError.bind(this,'getRecentJobs()'))
                      .subscribe(result => {
                        let act = {
                          type: RECENT_JOB_LIST_RESULT,
                          payload: {
                            result: result
                          }
                        }

                        this.appStateService.dispatch(act);
                      })

  }

  handleError(fnName,err:any,caught): any {
    console.log(`AppService Status: ${err.status} Message: ${err.statusText}`);

    /* const nAction = {
        type: NOTIFICATION,
        payload: {msg: `${GET_ACCOUNTS_ERROR}: ${err.statusText}`}
    };

    this.stateService.dispatch(nAction);*/

    const errAction = getErrorAction(err, fnName, "app.service.ts");
    this.appStateService.dispatch(errAction);

    //Return observable that emits empty array. This will call fn passed to subscribe() with value as []
    return Observable.of([]);
  }
}
