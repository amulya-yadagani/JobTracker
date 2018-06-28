import { TestBed } from '@angular/core/testing';
import { JobListGridComponent } from "./job-list-grid.component";
import { AppStateService } from "../../../state/app-state.service";
import { Router } from '@angular/router';

fdescribe("JobListGridComponent", () => {
    let fixture, comp, router, debugEl, htmlEl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [JobListGridComponent],
            providers: [AppStateService]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JobListGridComponent);
                comp = fixture.componentInstance;
                router = TestBed.get(Router);
            });
    });

    fit('should create the app', () => {
        expect(comp).toBeTruthy();
    });

})