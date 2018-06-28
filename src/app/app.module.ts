import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, RouteReuseStrategy } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';

import { AppRoutingModule, Components } from "./app.routing";
import { AppComponent } from './app.component';
import { TabComponent } from "./components/job/tab/tab.component";
import { ReuseStrategy } from './utils/reuse-strategy';
import { AppStateService } from './state/app-state.service';

import { FileDetailsPopUpComponent } from './components/search/shared-components/file-details/file-details-popup/file-details-popup.component';
import { FileDetailsGridComponent } from './components/search/shared-components/file-details/file-details-grid/file-details-grid.component';
import { ThumbnailResponsePopupComponent } from './components/search/shared-components/thumbnail-response-popup/thumbnail-response-popup.component';
import { SearchStateService } from './components/search/search-state.service';
import { GlobalSearchService } from './components/search/global-search/global-search.service';
import { DownloadResponsePopUpComponent } from './components/search/shared-components/download-response-popup/download-response-popup.component';
// import { RequestNumberPopUpComponent } from './components/search/pdf-final-search/requestnumber/requestnumber.component';

import { AppService } from './app.service';

import { JobListService } from './components/job-list/job-list.service';
import { LoaderService } from './utils/loader.service';
import { LoggerService } from './utils/logger.service';
import { NotificationService } from './utils/notification.service';
import { PDFSearchService } from './components/search/pdf-final-search/pdf-final-search.service';
import { NoResultResponsePopupComponent } from './components/search/shared-components/no-result-response-popup/no-result-response-popup.component';
import { CoverSearchService } from "./components/search/cover-search/cover-search.service";
import { ValidationDirective } from './directives/validation.directive';
import { CanDeactivateGuard } from './guards/admin-table-guard';


@NgModule({
  declarations: [
    AppComponent,
    TabComponent,
    FileDetailsPopUpComponent,
    DownloadResponsePopUpComponent,
    FileDetailsGridComponent,
    ThumbnailResponsePopupComponent,
    ...Components,
    NoResultResponsePopupComponent,
    // RequestNumberPopUpComponent,
    ValidationDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonsModule,
    DialogModule,
    DropDownsModule,
    DatePickerModule
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: ReuseStrategy},
    AppStateService,
    AppService,
    LoaderService,
    LoggerService,
    NotificationService,
    JobListService,
    SearchStateService,
    GlobalSearchService,
    PDFSearchService,
    CoverSearchService,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TabComponent,
    ThumbnailResponsePopupComponent,
    DownloadResponsePopUpComponent,
    FileDetailsPopUpComponent,
    FileDetailsGridComponent,
    NoResultResponsePopupComponent,
    // RequestNumberPopUpComponent
  ]
})
export class AppModule { }
