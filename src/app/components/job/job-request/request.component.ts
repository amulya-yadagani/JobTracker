import { Component, Input } from "@angular/core";


@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent {

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
