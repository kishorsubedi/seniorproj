import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalandarViewComponent } from './calandar-view.component';

describe('CalandarViewComponent', () => {
  let component: CalandarViewComponent;
  let fixture: ComponentFixture<CalandarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalandarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalandarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
