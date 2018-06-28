import { Component, Input } from "@angular/core";
//import { ParamMap, ActivatedRoute } from "@angular/router";

@Component({
  selector: "tab",
  styleUrls: ['./tab.component.scss'],
  templateUrl: "./tab.component.html"
})
export class TabComponent {
  title:string;
  active = false;
  isCloseable = false;
  id;
  _job;

  constructor() {
  }

  set job(value) {
    if(value) {
      this.title = value.title;
      this.isCloseable = value.closeable;
      this.id = value.id;
      this._job = value;
    }
  }
}
