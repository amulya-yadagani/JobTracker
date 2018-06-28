import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JtGeneratedThumbnailInfoComponent } from './thumbnail-response-popup.component';

describe('JtGeneratedThumbnailInfoComponent', () => {
  let component: JtGeneratedThumbnailInfoComponent;
  let fixture: ComponentFixture<JtGeneratedThumbnailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JtGeneratedThumbnailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JtGeneratedThumbnailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
