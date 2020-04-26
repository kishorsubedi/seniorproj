import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgProDashboardComponent } from './org-pro-dashboard.component';

describe('OrgProDashboardComponent', () => {
  let component: OrgProDashboardComponent;
  let fixture: ComponentFixture<OrgProDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgProDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgProDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
