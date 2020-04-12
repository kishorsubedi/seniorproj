import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMembersBox } from './view-members-box';

describe('MembersListComponent', () => {
  let component: ViewMembersBox;
  let fixture: ComponentFixture<ViewMembersBox>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMembersBox ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMembersBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
