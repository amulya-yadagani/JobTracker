import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { jQuery as $ } from "@progress/kendo-ui/js/kendo.core.js";

import { AppStateService, NEW_JOB_REQUEST, RECENT_JOB_REQUEST, RECENT_JOB_LIST, RECENT_JOB_LIST_RESULT } from './state/app-state.service';
import { AppService } from './app.service';
import { JobListService } from './components/job-list/job-list.service';
import { LoaderService } from './utils/loader.service';
import { LoggerService } from './utils/logger.service';
import { NotificationService } from './utils/notification.service';
import { PDFSearchService } from './components/search/pdf-final-search/pdf-final-search.service';

//Expose jquery as kendo ui library uses it
window['jQuery'] = $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  displayName = "Guest"
  searchType = "";
  recentJobList;

  constructor(private router: Router, private stateService:AppStateService,
                                      private appService: AppService,
                                      private joblist: JobListService,
                                      private loaderService: LoaderService,
                                      private loggerService: LoggerService,
                                      private notificationService:NotificationService,
                                      private pdfSearchService:PDFSearchService) {
    this.stateService.subscribe(RECENT_JOB_LIST_RESULT, this.onJobListResult.bind(this));
  }

  ngOnInit() {
    //getUserInfo() is a getter function that is set in main.ts once authentication is successful
    let user = window["getUserInfo"]();

    if(user) {
      this.stateService.userInfo = user;
      this.displayName = user.displayName;
    }
  }

  /**
   * Since we want the menu to appear on mouse enter, we need to simulate click behavior
   * on mouse enter/leave. So we need to handle that manually
   */
  onMenuMouseEnter(e) {
    //'$' here is the jQuery used by bootstrap. Show the menu
    window['$'](e.currentTarget).trigger('click.bs.dropdown');

    if(e.currentTarget.innerText.search("Search By") != -1) {
      let action = {
        type: RECENT_JOB_LIST,
        payload: {
          result: null
        }
      }

      this.stateService.dispatch(action);
    }
  }

  onJobListResult(action) {
    this.recentJobList = action.payload.result;
  }

  onMenuMouseLeave(e) {
    //'$' here is the jQuery used by bootstrap. Hide the menu
    window['$'].fn.dropdown.Constructor.prototype.toggle();
  }

  onMenuItemSelect(e) {
    e.preventDefault();

    if(e.target.tagName !== "A") return;

    if("job" in e.target.dataset) {
      //Load job request
      let requestNo = e.target.dataset.job;
      if(requestNo) {
        this.router.navigateByUrl("/job-request").then(() => {
          let title = requestNo == e.target.textContent ? `Request ${requestNo}` : e.target.textContent;
          this.stateService.dispatch({
            type: RECENT_JOB_REQUEST,
            payload: {
              id: requestNo,
              displayItem: e.target.textContent,
              title: title,
              overview: null,
              details: null,
              closeable: true
            }
          });
        });
      }

      return;
    }

    this.searchType = `Enter ${e.target.textContent}`;

    //hide the menu
    window['$'].fn.dropdown.Constructor.prototype.toggle();
  }

  onToolsItemSelect(e) {
    if(e.target.tagName !== "A") return;

    let item = e.target.textContent;

    if(item == "Reports") {
      //Do not prevent default behavior else the link wont open
      return;
    }

    //hide the menu
    window['$'].fn.dropdown.Constructor.prototype.toggle();
    e.preventDefault();
  }

  onLogoClick() {
    this.router.navigateByUrl("/job-list");
  }

  onNewJobRequest() {
    this.router.navigateByUrl("/job-request").then(() => {
      let requestNo = parseInt(`${Math.random()*10000}`);
      let title = `Request ${requestNo}`;
      this.stateService.dispatch({
        type: NEW_JOB_REQUEST,
        payload: {
          id: requestNo,
          title: title,
          overview: null,
          details: null,
          closeable: true
        }
      });
    });
  }
}
