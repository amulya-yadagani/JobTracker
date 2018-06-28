import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultResponsePopupComponent } from './no-result-response-popup.component';

describe('NoResultResponsePopupComponent', () => {
  let component: NoResultResponsePopupComponent;
  let fixture: ComponentFixture<NoResultResponsePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoResultResponsePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultResponsePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
