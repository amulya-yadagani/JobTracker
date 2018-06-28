import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from "./components/job/tab/tabs.component";
import { JobRequestComponent } from "./components/job/job-request/job-request.component";
import { JobListComponent } from "./components/job-list/job-list.component";
import { MyToDoListComponent } from './components/job-list/my-todo-list/my-todo-list.component';
import { AllMyJobsComponent } from './components/job-list/all-my-jobs/all-my-jobs.component';
import { AllJobsComponent } from './components/job-list/all-jobs/all-jobs.component';
import { CreativeToDoListComponent } from './components/job-list/creative-todo-list/creative-todo-list.component';

import { RequestComponent } from './components/job/job-request/request.component';
import { ScheduleComponent } from './components/job/schedule/schedule.component';
import { ApprovalComponent } from './components/job/approval/approval.component';
import { AdminTablesComponent } from './components/admin/admin-tables.component';
import { PremiumCategoryComponent } from './components/admin/permium-category/premium-category.component';
import { PremiumSubCategoryComponent } from './components/admin/premium-sub-category/premium-sub-category.component';
import { AAMTagComponent } from './components/admin/aam-tag/aam-tag.component';
import { MagazineComponent } from './components/admin/magazine/magazine.component';
import { CompTableComponent } from './components/admin/component-table/component-table.component';

//search component
import { SearchComponent } from './components/search/search.component';
import { GlobalSearchComponent } from './components/search/global-search/global-search.component';
import { GlobalThumbNailComponent } from './components/search/global-search/global-thumb-nail/global-thumb-nail.component';
import { GlobalGridListComponent } from './components/search/global-search/global-grid-list/global-grid-list.component';
import { PdfFinalSearchComponent } from './components/search/pdf-final-search/pdf-final-search.component';
import { SearchButtonBarComponent } from './components/search/shared-components/search-button-bar/search-button-bar.component';
// import { SearchTabComponent } from './components/search/search-tab/search-tab.component';
import { CoverSearchComponent } from './components/search/cover-search/cover-search.component';
import { JTDropdownComponent } from './components/search/shared-components/jt-drop-down/jt-drop-down.component';
import { GridlistComponent } from './components/search/shared-components/gridlist/gridlist.component';
import { JtInputComponent } from './components/search/shared-components/jt-input/jt-input.component';
import { ButtonbBarComponent } from './components/search/shared-components/button-bar/button-bar.component';
import { ResultTabComponent } from './components/search/shared-components/result-tab/result-tab.component';
import { ThumbnailComponent } from './components/search/shared-components/thumbnail/thumbnail.component';
import { JobListGridComponent } from './components/job-list/grid/job-list-grid.component';
import { MultiSelectComponent } from './components/common/multi-select/multi-select.component';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { DownloadResponsePopUpComponent } from './components/search/shared-components/download-response-popup/download-response-popup.component';
import { JobRequestOverviewComponent } from './components/job/job-request/overview/overview.component';
import { CanDeactivateGuard } from './guards/admin-table-guard';

const routes: Routes = [
  { path: 'job-request', component: JobRequestComponent },
  {
    path: 'job-list',
    component: JobListComponent,
    children: [
      { path: '', redirectTo: 'my-todo-list', pathMatch: 'full' },
      { path: 'my-todo-list', component: MyToDoListComponent },
      { path: 'all-my-jobs', component: AllMyJobsComponent },
      { path: 'all-jobs', component: AllJobsComponent },
      { path: 'creative-todo-list', component: CreativeToDoListComponent }
    ]
  },
  {
    path: 'search',
    component: SearchComponent,
    children: [
      { path: '', redirectTo: 'global', pathMatch: 'full' },
      { path: 'global', component: GlobalSearchComponent },
      { path: 'pdf', component: PdfFinalSearchComponent },
      { path: 'cover', component: CoverSearchComponent }
    ]
  },
  {
    path: 'admin-tables',
    component: AdminTablesComponent,
    canDeactivate: [CanDeactivateGuard],
    children: [
      { path: '', redirectTo: 'prem-category', pathMatch: 'full' },
      { path: 'prem-category', component: PremiumCategoryComponent },
      { path: 'prem-sub-category', component: PremiumSubCategoryComponent },
      { path: 'aam-tag', component: AAMTagComponent },
      { path: 'magazine', component: MagazineComponent },
      { path: 'component', component: CompTableComponent }
    ]
  },
  {
    path: '',
    redirectTo: 'job-list',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'job-list',//Redirect to job-list for any undefined route
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}

export const Components = [
  TabsComponent,
  JobRequestComponent,
  DynamicTabsDirective,
  JobListComponent,
  JobListGridComponent,
  MyToDoListComponent,
  AllMyJobsComponent,
  AllJobsComponent,
  CreativeToDoListComponent,
  RequestComponent,
  JobRequestOverviewComponent,
  ScheduleComponent,
  ApprovalComponent,
  AdminTablesComponent,
  PremiumCategoryComponent,
  PremiumSubCategoryComponent,
  AAMTagComponent,
  MagazineComponent,
  CompTableComponent,
  DynamicTabsDirective,

  //search
  SearchComponent,
  GlobalSearchComponent,
  GlobalThumbNailComponent,
  GlobalGridListComponent,
  PdfFinalSearchComponent,
  SearchButtonBarComponent,
  CoverSearchComponent,
  JTDropdownComponent,
  GridlistComponent,
  JtInputComponent,
  ButtonbBarComponent,
  ResultTabComponent,
  ThumbnailComponent,
  MultiSelectComponent,
  DownloadResponsePopUpComponent,
];

