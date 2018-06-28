import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobRequestComponent } from './components/job/job-request/job-request.component';
import { MyToDoListComponent } from './components/job-list/my-todo-list/my-todo-list.component';
import { AllMyJobsComponent } from './components/job-list/all-my-jobs/all-my-jobs.component';
import { AllJobsComponent } from './components/job-list/all-jobs/all-jobs.component';
import { CreativeToDoListComponent } from './components/job-list/creative-todo-list/creative-todo-list.component';
import { AppStateService } from './state/app-state.service';
import { By } from '@angular/platform-browser';
import { AppService } from './app.service';
import { MyTodoListService } from './components/job-list/my-todo-list/my-todo-list.service';
import { LoaderService } from './utils/loader.service';
import { LoggerService } from './utils/logger.service';

@Injectable()
class MockAppService{}
@Injectable()
class MockMyTodoListService{}
@Injectable()
class MockLoaderService{}
@Injectable()
class MockLoggerService{}

describe('AppComponent', () => {
  let fixture, comp, router, debugEl, htmlEl;
  window["getUserInfo"] = () => (
    {
      userDetails: {accountName:"hirparaj",displayName:"Guest"},
      userRoleList: [{
        roleId: 1,
        roleName: "Admin"
      }]
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        JobListComponent,
        JobRequestComponent,
        MyToDoListComponent,
        AllMyJobsComponent,
        AllJobsComponent,
        CreativeToDoListComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
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
          { path: '',
            redirectTo: 'job-list',
            pathMatch: 'full'
          },
          { path: '**', component: JobRequestComponent }
        ])
      ],
      providers: [AppStateService,
        {provide: AppService , useclass : MockAppService},
        {provide: MyTodoListService , useclass : MockMyTodoListService},
        {provide: LoaderService , useclass : MockLoaderService},
        {provide: LoggerService , useclass : MockLoggerService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
      router = TestBed.get(Router);
    });
  }));

  it('should create the app', () => {
    expect(comp).toBeTruthy();
  });

  it('should display Welcome Guest', () => {
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(".user > span"));
    htmlEl = debugEl.nativeElement;
    expect(htmlEl.textContent).toContain('Guest');
  });

  it('should by default navigate to /job-list/my-todo-list', async(() => {
    router.initialNavigation();
    router.navigate(['/']).then(() => {
      expect(router.url).toEqual('/job-list/my-todo-list');
    });
  }));

  it('should have view button label as Job Request', () => {
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(".jt-link"));
    htmlEl = debugEl.nativeElement;
    expect(htmlEl.textContent).toEqual('Job Request');
  });

  it('should navigate to Job Request view when the view button is clicked', async(() => {
    fixture.detectChanges();
    router.navigate(['/']).then(() => {
      debugEl = fixture.debugElement.query(By.css(".jt-link"));
      htmlEl = debugEl.nativeElement;
      router.events.subscribe((e) => {
        if(e instanceof NavigationEnd)
          expect(router.url).toContain('job-request');
      });
      htmlEl.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
  }));

  it('should have view button label changed to Job List after navigating to Job Request view', async(() => {
    fixture.detectChanges();
    router.navigate(['/']).then(() => {
      debugEl = fixture.debugElement.query(By.css(".jt-link"));
      htmlEl = debugEl.nativeElement;
      router.events.subscribe((e) => {
        if(e instanceof NavigationEnd){
          fixture.detectChanges();
          debugEl = fixture.debugElement.query(By.css(".jt-link"));
          htmlEl = debugEl.nativeElement;
          expect(htmlEl.textContent).toEqual('Job List');
        }
      });
      //Simulate click event
      htmlEl.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
  }));

  it('should have view button label changed to Job Request after navigating to Job List view', async(() => {
    fixture.detectChanges();
    router.navigate(['/job-list']).then(() => {
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(".jt-link"));
      htmlEl = debugEl.nativeElement;
      expect(htmlEl.textContent).toEqual('Job Request');
    });
  }));

  it('should redirect to Job List view when logo is clicked', async(() => {
    fixture.detectChanges();
    router.navigate(['/job-request']).then(() => {
      debugEl = fixture.debugElement.query(By.css(".navbar-brand"));
      htmlEl = debugEl.nativeElement;
      router.events.subscribe((e) => {
        if(e instanceof NavigationEnd){
          expect(router.url).toContain('job-list');
        }
      });
      //Simulate click event
      //htmlEl.dispatchEvent(new MouseEvent("click",{bubbles:true}));
      comp.onLogoClick();
    });
  }));
});
