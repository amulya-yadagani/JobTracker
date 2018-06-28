import { Component, ViewChild } from "@angular/core";
import { TabsComponent } from "../tab/tabs.component";
import { AppStateService, NEW_JOB_REQUEST, RECENT_JOB_REQUEST, OPEN_JOB_REQUEST } from "../../../state/app-state.service";

@Component({
  selector: "job-request",
  templateUrl: "./job-request.component.html",
  styleUrls: ["./job-request.component.scss"]
})
export class JobRequestComponent {
  @ViewChild(TabsComponent)
  tabs:TabsComponent;

  constructor(private stateService:AppStateService){
    this.stateService.subscribe(NEW_JOB_REQUEST,this.onNewJobRequest.bind(this));
    this.stateService.subscribe(RECENT_JOB_REQUEST,this.onRecentJobRequest.bind(this));
    this.stateService.subscribe(OPEN_JOB_REQUEST,this.onOpenJobRequest.bind(this));
  }

  onNewJobRequest(action) {
    this.tabs.openTab(action.payload);
  }

  onRecentJobRequest(action) {
    this.tabs.openTab(action.payload);
  }

  onOpenJobRequest(action) {
    this.tabs.openTab(action.payload);
  }
}
