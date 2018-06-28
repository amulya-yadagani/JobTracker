import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonbBarComponent } from './button-bar.component';

describe('ResultActionsComponent', () => {
  let component: ButtonbBarComponent;
  let fixture: ComponentFixture<ButtonbBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonbBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonbBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
