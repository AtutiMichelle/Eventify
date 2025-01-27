import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { EventVerificationComponent } from './event-verification/event-verification.component';
import { TagPrintingComponent } from './tag-printing/tag-printing.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'register', component: AuthComponent },
  { path: 'event-registration', component: EventRegistrationComponent },
  { path: 'event-verification', component: EventVerificationComponent },
  { path: 'tag-printing', component: TagPrintingComponent },
  { path: 'user-dashboard', component:DashboardComponent},

];
