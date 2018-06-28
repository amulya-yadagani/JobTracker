import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  AppStateService,
} from '../../../../state/app-state.service';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonbBarComponent implements OnInit {
  @Output() onResultAction = new EventEmitter();
  @Input()
  public set onResultActionConfig(actionConfig) {
    // this._resultActionsService.setConfigAction(actionConfig);
    if (actionConfig && actionConfig.length > 0) {
      this.resultActionList = actionConfig;
    }
  }
  @Input()
  public set onResultTabType(onResultTabType) {
    this.tabType = onResultTabType;
  }
  @Input()
  public set onResultType(onResultType) {
    this.type = onResultType;
  }
  // @Input()
  // public set onActionUpdate(actionUpdated) {
  //   this.resultActionList = this._resultActionsService.getConfigAction();
  // }
  private tabType;
  private type;
  // private actionCombination = {
  //   thumbnail: {
  //     enable: {
  //       'SELECTALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT'],
  //       'CLEARALL' : ['SELECTALL']
  //     },
  //     disable: {
  //       'SELECTALL' : ['SELECTALL'],
  //       'CLEARALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
  //     }
  //   },
  //   list: {
  //     enable: {
  //       'SELECTALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT'],
  //       'CLEARALL' : ['SELECTALL']
  //     },
  //     disable: {
  //       'SELECTALL' : ['SELECTALL'],
  //       'CLEARALL' : ['CLEARALL', 'DOWNLOAD', 'THUMBNAIL', 'EXPORT']
  //     }
  //   }
  // };
  resultActionList = [];
  resultActionSel = { selTxt: '' };
  constructor(
    private _appStateService: AppStateService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    // this._appStateService.subscribe(this.onSelectedThumbnail.bind(this));
  }

  ngOnInit() {
    // NOT used ... this.resultActionList = this._resultActionsService.getConfigAction();
  }

  selectedAction(selAction) {
    // coming from component button selection...
    const actionInfo = {
      triggeredBy: 'button',
      selAction: selAction.prop,
      resultActions: this.resultActionList,
      type: this.type,
      tabType: this.tabType
    };
    // this.onEnableDisableActionConfig(selAction.prop, this.type, this.tabType);
    this.onResultAction.emit(actionInfo);
  }

  getIndexActionConfig(actionList, locator) {
    let index;
    actionList.forEach((eachList, id) => {
      if (eachList.prop === locator) {
        index = id;
      }
    });
    return index;
  }

  // setEnableCombination(actionType, accessType) {
  //   return this.resultActionList.map((eachAction) => {
  //     const actionMatch = this.actionCombination[accessType].enable[actionType].some((actionComb) => {
  //       return (actionComb === eachAction.prop);
  //     });
  //     if (actionMatch) { eachAction.disable = eachAction.selected = false; }
  //     return eachAction;
  //   });
  // }
  // setDisableCombination(actionType, accessType) {
  //   return this.resultActionList.map((eachAction) => {
  //     const actionMatch = this.actionCombination[accessType].disable[actionType].some((actionComb) => {
  //       return (actionComb === eachAction.prop);
  //     });
  //     if (actionMatch) { eachAction.disable = eachAction.selected = true; }
  //     return eachAction;
  //   });
  // }

  onSelectedThumbnail() { }
}
