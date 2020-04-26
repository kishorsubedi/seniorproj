import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { orgdashboardComponent } from './orgdashboard.component';

describe('orgdashboardComponent', () => {
  let component: orgdashboardComponent;
  let fixture: ComponentFixture<orgdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ orgdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(orgdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
