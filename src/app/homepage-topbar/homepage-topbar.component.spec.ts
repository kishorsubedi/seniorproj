import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageTopbarComponent } from './homepage-topbar.component';

describe('HomepageTopbarComponent', () => {
  let component: HomepageTopbarComponent;
  let fixture: ComponentFixture<HomepageTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
