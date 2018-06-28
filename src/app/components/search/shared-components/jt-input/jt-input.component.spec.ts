import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JtInputComponent } from './jt-input.component';

describe('JtInputComponent', () => {
  let component: JtInputComponent;
  let fixture: ComponentFixture<JtInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JtInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JtInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
