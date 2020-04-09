import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdminComponent} from './dashboard-admin/dashboard-admin.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginSignUpBoxComponent } from './login-sign-up-box/login-sign-up-box.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CalendarComponent } from './calendar/calendar.component';


const routes: Routes = [
  {path: 'calendar', component: CalendarComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: '',      component: HomepageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
