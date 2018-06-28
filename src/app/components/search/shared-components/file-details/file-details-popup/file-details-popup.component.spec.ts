import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsPopUpComponent } from './file-details-popup.component';

describe('DigitalAssetDetailsSearchComponent', () => {
  let component: FileDetailsPopUpComponent;
  let fixture: ComponentFixture<FileDetailsPopUpComponent>;
    
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDetailsPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDetailsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
