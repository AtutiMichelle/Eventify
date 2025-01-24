import { Component } from '@angular/core';
import { EventRegistrationComponent } from './event-registration/event-registration.component';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';  


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventRegistrationComponent,DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Eventify';
}
