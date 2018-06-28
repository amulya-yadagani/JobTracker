import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsGridComponent } from './file-details-grid.component';

describe('FileDetailsGridComponent', () => {
  let component: FileDetailsGridComponent;
  let fixture: ComponentFixture<FileDetailsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDetailsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDetailsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
