import { Injectable } from '@angular/core';

import { AppStateService, LOADER } from "../state/app-state.service";

let $ = null;

@Injectable()
export class LoaderService {

    private el:any;
    
    constructor(private stateService:AppStateService) {
      $ = window["jQuery"];
      this.el = $("#loader");

      stateService.subscribe(LOADER, this.showHideLoader.bind(this));
    }

    showHideLoader(action) {
      if(this.el && action) {
        this.el.toggleClass("is-active",action.payload.show);
      }
    }
}
