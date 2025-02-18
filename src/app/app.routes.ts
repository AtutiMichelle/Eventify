import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthComponent } from './auth/auth.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { EventVerificationComponent } from './event-verification/event-verification.component';
import { TagPrintingComponent } from './tag-printing/tag-printing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { CRUDEventsComponent } from './admin/crud-events/crud-events.component';
import { CrudEventRegistrationsComponent } from './admin/crud-event-registrations/crud-event-registrations.component';
import { IndividualEventDetailsComponent } from './events/individual-event-details/individual-event-details.component';



export const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'register', component: AuthComponent },
  { path: 'event-registration', component: EventRegistrationComponent },
  { path: 'event-verification', component: EventVerificationComponent },
  { path: 'tag-printing', component: TagPrintingComponent },
  { path: 'user-dashboard', component:DashboardComponent},
  { path: 'events', component: EventsComponent },
  { path: 'admin-dashboard', component: AdminComponent},
  { path: 'users', component: UsersComponent},
  { path: 'events-CRUD', component: CRUDEventsComponent},
  { path: 'CRUD-event-registrations', component: CrudEventRegistrationsComponent },
  { path: 'event-details/:id', component: IndividualEventDetailsComponent }
  

];

