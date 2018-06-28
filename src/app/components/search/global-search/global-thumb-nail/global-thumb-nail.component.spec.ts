import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalThumbNailComponent } from './global-thumb-nail.component';

describe('GlobalThumbNailComponent', () => {
  let component: GlobalThumbNailComponent;
  let fixture: ComponentFixture<GlobalThumbNailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalThumbNailComponent ]
    })
    .compileComponents();
  }));
    
  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalThumbNailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
