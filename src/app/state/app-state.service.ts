import { Injectable, EventEmitter } from '@angular/core';
import { initialAppState, ROLE_ADMIN, ROLE_TAG_PM } from '../utils/constants';
import { RequestOptions, Headers } from '@angular/http';

export const NEW_JOB_REQUEST = "new job request";
export const RECENT_JOB_REQUEST = "recent job request";
export const OPEN_JOB_REQUEST = "open job request";
export const LOADER = "show hide loader";
export const LOG_TO_SERVER = "log to server";

export const RECENT_JOB_LIST = "recent job list";
export const RECENT_JOB_LIST_RESULT = "recent job list result";

// ----------- Search Component Actions ----------------- //
export const SEARCH_SELECTED_TAB = 'selected tab';
export const SEARCH_SELECTED_SUB_TAB = 'selected sub tab';
export const SEARCH_RESULT = 'search result';
export const SEARCH_CLEAR = 'search clear';
export const SEARCH_GLOBAL_THUMBNAIL = 'search global thumbnail';
export const SEARCH_GLOBAL_SELECTED_TAB = 'search global tab';
// event actions for global search...
export const SEARCH_GLOBAL_RESULT = 'global search result';
export const SEARCH_GLOBAL_THUMBNAIL_RESULT = 'global thumbnail search result';
export const SEARCH_GLOBAL_DOWNLOAD_RESULT = 'global download search result';
export const SEARCH_GLOBAL_THUMBNAIL_DETAILS_RESULT = 'global thumbnail details search result';
export const SEARCH_GLOBAL_GRIDLIST_DETAILS_RESULT = 'global gridlist details search result';
export const SEARCH_GLOBAL_DOWNLOAD_MSG_RESULT = 'global search download exist';
// event actions for pdf search...
export const SEARCH_PDF_DOWNLOAD_RESULT = 'pdf download search result';
export const SEARCH_PDF_THUMBNAIL_DETAILS_RESULT = 'pdf thumbnail details search result';
export const SEARCH_PDF_GRID_DETAILS_RESULT = 'pdf grid search result';
export const SEARCH_PDF_REG_THUMBNAIL_RESULT = 'pdf thumbnail regenerate result';
export const SEARCH_PDF_DOWNLOAD_MSG_RESULT = 'pdf download exists';
export const SEARCH_PDF_REQUEST_NO = 'pdf request number';
//------------------------------------------------------- //
export const COVER_SEARCH_THUMBNAIL_DETAILS_RESULT = 'cover thumbnail details search result';

export const MY_JOB_LIST="my job list";
export const MY_JOB_LIST_RESULT="my job list result";

export const MY_JOB_LIST_COLUMN_DATA = "my job list column data";
export const MY_JOB_LIST_COLUMN_DATA_RESULT = "my job list column data result";

export const NOTIFICATION = "notification";

export const PDF_SEARCH_METADATA = "pdf search metadata";
export const PDF_SEARCH_METADATA_RESULT = "pdf search metadata result";
export const PDF_SEARCH = "pdf search";
export const PDF_SEARCH_RESULT = "pdf search result";

export const COVER_SEARCH_RESULT = 'cover search result';
export const COVER_SEARCH_THUMBNAIL_RESULT = 'cover thumbnail search result';
export const COVER_SEARCH_METADATA = "cover search metadata";
export const COVER_SEARCH_METADATA_RESULT = 'cover search metadata result';
export const SEARCH_COVER_DOWNLOAD_RESULT = 'cover download search result';
export const SEARCH_COVER_DOWNLOAD_MSG_RESULT = 'cover download exists';
export const SEARCH_COVER_REG_THUMBNAIL_RESULT = 'cover thumbnail regenerate result';
export const COVER_SEARCH_CIRCMAN_METADATA = 'cover circman data';
export const COVER_SEARCH_CIRCMAN_METADATA_RESULT = 'cover circman data result';

@Injectable()
export class AppStateService {

  private dispatcherMap: Object = {};
  private state = initialAppState;

  constructor() {

  }

  dispatch(action) {
    if (action.type && this.dispatcherMap.hasOwnProperty(action.type)) {
      let subject = this.dispatcherMap[action.type];
      subject.emit(action);
    }
  }

  subscribe(actionType, nextFn, errFn = null) {
    if (!this.dispatcherMap.hasOwnProperty(actionType)) {
      this.dispatcherMap[actionType] = new EventEmitter();
    }

    if (!errFn)
      errFn = (err) => { console.log(`Error handled in AppStateService: ${err}`) }

    let subscription = this.dispatcherMap[actionType].subscribe(nextFn, errFn);
    return subscription;
  }

  showLoader(value) {
    this.dispatch({
      type: LOADER,
      payload: {
        show: value
      }
    });
  }

  /**
   * This function displays a notification. If called with an error object, the message is
   * taken from the error object and the property 'notificationType' from api response
   * decides if the error is to be displayed. It can have values Ignore|Hide|Show.
   *
   * If no error object is passed and a msg is passed then it will be displayed as a notification
   * instead. Either err or msg will be displayed as notification with preference given to
   * err
   * @param err The err object that is returned when handling an http response
   * @param msg If message to be displayed as notification
   */
  showNotification(err, msg) {
    let response = null;
    let show = true;
    let message = "An error occurred!!";

    if(err) {
      try {
        response = err.json();
        message = response.message;
        show = response.notificationType == "Show";
      }
      catch(e) {
        //Not an api error but either network error or some other error
        if("text" in err) {
          message += ` -> ${err.text()}`;
        }

        if("url" in err) {
          message += ` Url -> ${err.url}`;
        }
      }
    }
    else if(msg) {
      message = msg
    }

    if(show || message) {
      this.dispatch({
        type: NOTIFICATION,
        payload: {
          msg: message
        }
      })
    }
  }

  set userInfo(user) {
    this.state.userInfo = user;

    if(user.userRoleInfo) {
      let keys = Object.keys(user.userRoleInfo);
      keys.forEach(id => {
        this.state.userRoles.push(user.userRoleInfo[id].toLowerCase());
      })
    }
  }

  get userInfo() {
    return this.state.userInfo;
  }

  get isAdmin(){
    return this.state.userRoles.join(",").search(ROLE_ADMIN) != -1;
  }

  get isTagPM() {
    return this.state.userRoles.join(",").search(ROLE_TAG_PM) != -1;
  }

  get noChacheHeaders() {
    let headers = new Headers({
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    });

    return new RequestOptions({
      headers: headers
    });
  }
}