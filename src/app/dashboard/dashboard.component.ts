import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventItem {
  id: number;
  date: string;
  name: string;
  type: string;
  amount: string; 
  user: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],
})
export class DashboardComponent {
  username: string | null = '';
  registeredEvents: EventItem[] = [];

  constructor() {
    // Retrieve the username from local storage
    this.username = localStorage.getItem('username');
    console.log('Logged in user:', this.username);

    // Retrieve the registered events from local storage
    const eventsData = localStorage.getItem('registeredEvents');
    if (eventsData) {
      const allEvents: EventItem[] = JSON.parse(eventsData);
      console.log('All Events:', allEvents);
      // Filter events for the logged-in user
      this.registeredEvents = allEvents.filter(
        (event) => event.user === this.username
      );
      console.log('Registered Events for user:', this.registeredEvents);
    }
  }
}
