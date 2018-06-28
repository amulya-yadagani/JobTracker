import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JTDropdownComponent } from './jt-drop-down.component';

describe('DropdownComponent', () => {
  let component: JTDropdownComponent;
  let fixture: ComponentFixture<JTDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JTDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JTDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
