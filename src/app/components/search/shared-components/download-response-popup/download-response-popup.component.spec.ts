import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDownloadInfoComponent } from './generate-download-info.component';

describe('GenerateDownloadInfoComponent', () => {
  let component: GenerateDownloadInfoComponent;
  let fixture: ComponentFixture<GenerateDownloadInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateDownloadInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDownloadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
