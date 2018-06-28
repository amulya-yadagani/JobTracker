import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Http, BaseRequestOptions, BaseResponseOptions, XHRBackend, XHRConnection, BrowserXhr, CookieXSRFStrategy } from '@angular/http';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { USER_INFO_URL } from "./app/utils/constants";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/of";

if (environment.production) {
  enableProdMode();
}

//Write the build version as attribute
document.documentElement.setAttribute("jt-version",environment.version)

/**
 * Create a strategy which does nothing.
 * This is done just to create an instance of Http so that we can make a call to get user info
 * Reference - https://stackoverflow.com/questions/39452451/angular2-ansychronous-bootstrapping-with-external-json-configuration-file/39454713#39454713
 */
class NoopCookieXSRFStrategy extends CookieXSRFStrategy {
  configureRequest(request) {
    // noop
  }
}

function getUserInfo() {
  let reqOptions = new BaseRequestOptions();
  let respOptions = new BaseResponseOptions();

  return new Http(new XHRBackend(new BrowserXhr(),respOptions,new NoopCookieXSRFStrategy()),reqOptions).get(USER_INFO_URL)
                  .map(response => response.json())
                  .catch((err,observable) => {
                    console.log("Error occurred when getting user info -> ",err)
                    let result = {};
                    try {
                      result = err.json();
                    }
                    catch(e) {
                      //fail silently
                    }

                    populateErrResult(result);

                    return Observable.of(result);
                  });
}

function hideLoader() {
  let el:any = document.querySelector("#loader");
  if(el) {
    el.classList.toggle('is-active',false);
    el.textContent = '';
  }
}

function populateErrResult(result) {
  if(!result) result = {};

  result.isError = true;
  if(!result.errorMessage)
    result.errorMessage = "An error occurred while authenticating. Please inform the application admin";
  if(!result.message)
    result.message = ""

  return result;
}

let sub = getUserInfo();
sub.subscribe((response) => {
  let el = document.querySelector(".root");

  if(!environment.production) {
    if(response.model) {
      window["getUserInfo"] = () => response.model;
    }
    else {
      window["getUserInfo"] = () => (
        {
          accountName:"hirparaj",
          displayName:"Guest",
          teamMemberId:5213,
          userRoleInfo: {
            "1": "Admin"
          }
        });
    }
  }
  else if("isError" in response) {
    hideLoader();

    if(response.isError) {
      el.textContent = `${response.errorMessage}`;
      return;
    }
    else if(!response.model) {
      el.textContent = "You are not authorized to access Job Tracker. Please contact your application administrator";
      return;
    }

    window["getUserInfo"] = () => response.model;

    let userRoleInfo = response.model.userRoleInfo;
    if(!userRoleInfo || Object.keys(userRoleInfo).length == 0) {
      el.textContent = "You do not have any role to access Job Tracker application";
      return;
    }
  }
  else if(response.status == 401) {
    el.textContent = "You are not authorized to access Job Tracker. Please contact your application administrator";
    hideLoader();
    return;
  }

  platformBrowserDynamic().bootstrapModule(AppModule);
  hideLoader();
})
