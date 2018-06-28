import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFinalSearchComponent } from './pdf-final-search.component';

describe('PdfFinalSearchComponent', () => {
  let component: PdfFinalSearchComponent;
  let fixture: ComponentFixture<PdfFinalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfFinalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFinalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
