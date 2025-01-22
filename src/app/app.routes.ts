import { Routes } from '@angular/router';

import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { EventVerificationComponent } from './event-verification/event-verification.component';
import { TagPrintingComponent } from './tag-printing/tag-printing.component';

export const routes: Routes = [

  { path: '', redirectTo: '/event-registration', pathMatch: 'full' },  // Default route
  { path: 'event-registration', component: EventRegistrationComponent }, // Route for registration
  { path: 'event-verification', component: EventVerificationComponent }, // Route for verification
  { path: 'tag-printing', component: TagPrintingComponent } // Route for tag printing
];
