import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngIf & *ngFor

interface EventItem {
  id: number;
  event_id: number;
  ticket_type: string;
  ticket_quantity: number;
  amount: number;
  event: { 
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
    ticket_price: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // ✅ Mark component as standalone
  imports: [CommonModule], // ✅ Add CommonModule for *ngIf and *ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string = '';
  userId: number | null = null;
  registeredEvents: EventItem[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('auth_token');
  
    if (!token) {
      console.error('❌ No auth token found.');
      this.errorMessage = 'User authentication token not found. Please log in again.';
      return;
    }
  
    console.log('🚀 Using Token:', token);

    this.http.get<any>('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      response => {
        console.log('✅ Full User API Response:', response);

        if (!response || !response.user || !response.user.id) {
          console.error('❌ User details missing:', response);
          this.errorMessage = 'User details not found. Please log in again.';
          return;
        }

        this.userId = response.user.id;
        this.username = response.user.name; 
        
        console.log('User ID:', this.userId);
        console.log('Username:', this.username);

        this.loadRegisteredEvents();
      },
      error => {
        console.error('❌ User API Error:', error);
        this.errorMessage = 'Error fetching user details. Please log in again.';
      }
    );
  }

  loadRegisteredEvents() {
    if (!this.userId) {
      console.log('❌ No user ID found');
      return;
    }
  
    const token = localStorage.getItem('auth_token');

    this.http.get<EventItem[]>(`http://127.0.0.1:8000/api/user-registrations/${this.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      response => {
        console.log('✅ Registered Events:', response);

        if (!response || response.length === 0) {
          console.warn('⚠ No events found for the user.');
          this.registeredEvents = [];
        } else {
          this.registeredEvents = response.map(eventReg => ({
            ...eventReg,
            event: eventReg.event || { id: 0, name: 'Unknown Event', date: 'N/A' }
          }));
        }
      },
      error => {
        console.error('❌ Error fetching registered events:', error);
        this.errorMessage = 'Error loading registered events.';
      }
    );
  }
}
