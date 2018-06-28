import { Component, Input, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { AppStateService } from "../../state/app-state.service";

@Component({
  selector: "job-list",
  templateUrl: "./job-list.component.html",
  styleUrls: ["./job-list.component.scss"]
})
export class JobListComponent implements OnInit {

  isAdmin = true;
  isTagPM = true;

  constructor(private route:ActivatedRoute, private appStateService:AppStateService) {
  }

  ngOnInit() {
    /* this.isAdmin = this.appStateService.isAdmin;
    this.isTagPM = this.appStateService.isTagPM; */
  }
}
