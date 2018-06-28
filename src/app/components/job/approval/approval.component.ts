import { Component, Input } from "@angular/core";


@Component({
  selector: 'approval',
  templateUrl: './approval.component.html',
  /* styleUrls: ['./schedule.component.scss'] */
})
export class ApprovalComponent {
  id;
  _job;

  @Input()
  set job(value) {
    if(value) {
      this.id = value.id;
      this._job = value;
    }
  }
}
