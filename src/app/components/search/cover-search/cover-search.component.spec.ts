import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverSearchComponent } from './cover-search.component';

describe('CoverSearchComponent', () => {
  let component: CoverSearchComponent;
  let fixture: ComponentFixture<CoverSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
