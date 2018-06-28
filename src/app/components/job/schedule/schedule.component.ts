import { Component, Input } from "@angular/core";


@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  /* styleUrls: ['./schedule.component.scss'] */
})
export class ScheduleComponent {
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
