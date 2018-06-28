import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNumberPopUpComponent } from './requestnumber.component';

describe('RequestnumberComponent', () => {
  let component: RequestNumberPopUpComponent;
  let fixture: ComponentFixture<RequestNumberPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestNumberPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNumberPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
