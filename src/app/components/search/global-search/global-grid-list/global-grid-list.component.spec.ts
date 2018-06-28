import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalGridListComponent } from './global-grid-list.component';

describe('GlobalGridListComponent', () => {
  let component: GlobalGridListComponent;
  let fixture: ComponentFixture<GlobalGridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalGridListComponent ]
    })
    .compileComponents();
  }));
    
  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
