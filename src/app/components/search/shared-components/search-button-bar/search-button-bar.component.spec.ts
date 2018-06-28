import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchButtonBarComponent } from './search-button-bar.component';

describe('SearchButtonBarComponent', () => {
  let component: SearchButtonBarComponent;
  let fixture: ComponentFixture<SearchButtonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchButtonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchButtonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
