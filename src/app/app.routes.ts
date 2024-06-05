import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventsComponent } from './components/events/events.component';
import { CreateEventComponent} from './components/create-event/create-event.component';
import { RecoverPassword } from './components/recover-password/recover-password.component';

import { AuthGuard } from './utils/auth.guard';
import { MyEventsComponent } from './components/my-events/my-events.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component: SignUpComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'events/create', component: CreateEventComponent, canActivate: [AuthGuard]},
  {path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard]},
  {path: 'recover', component: RecoverPassword},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}

];
