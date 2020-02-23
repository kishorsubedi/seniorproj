import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignUpBoxComponent } from './login-sign-up-box.component';

describe('LoginSignUpBoxComponent', () => {
  let component: LoginSignUpBoxComponent;
  let fixture: ComponentFixture<LoginSignUpBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSignUpBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignUpBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
