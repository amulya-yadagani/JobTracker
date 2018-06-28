import { Component, ContentChildren, QueryList, ViewChild, ComponentFactoryResolver } from "@angular/core";
import { Router } from "@angular/router";

import { TabComponent } from "./tab.component";
import { DynamicTabsDirective } from "../../../directives/dynamic-tabs.directive";

@Component({
  selector: "tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  dynTabs: TabComponent[] = [];

  @ContentChildren(TabComponent)
  tabs: QueryList<TabComponent>;

  @ViewChild(DynamicTabsDirective)
  dynTabPlaceholder: DynamicTabsDirective;

  constructor(private _factoryResolver:ComponentFactoryResolver, private router:Router){

  }

  /**
   * config {
   *  id,
   *  title,
   *  overview,
   *  details
   * }
   * @param config
   */
  openTab(job) {
    let factory = this._factoryResolver.resolveComponentFactory(TabComponent);
    let view = this.dynTabPlaceholder.container;
    let comp = view.createComponent(factory);

    let instance:any = comp.instance;
    instance.job = job;

    this.dynTabs.push(instance);

    this.selectTab(instance);
  }

  closeTab(tab) {
    let index = this.dynTabs.indexOf(tab);

    if(index >= 0) {
      this.dynTabs.splice(index,1);
      let view = this.dynTabPlaceholder.container;
      view.remove(index);

      if(index > 0) {
        this.selectTab(this.dynTabs[index-1])
      }
    }
  }

  selectTab(tab) {
    this.dynTabs.forEach(t => t.active = false);
    if(tab) {
      tab.active = true;
    }
  }
}
