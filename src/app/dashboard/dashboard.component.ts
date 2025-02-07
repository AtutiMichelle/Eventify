import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngIf & *ngFor

interface EventItem {
  event_id: number;
  event_name: string;
  date: string;
  location: string;
  description: string;
  ticket_type: string;
  ticket_quantity: number;
  payment_method: string;
  verification_code: string;
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

    this.http.get<any>('http://127.0.0.1:5000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      response => {
        console.log('✅ Full User API Response:', response);

        if (!response || !response.id) { // Adjusted for Node.js response
          console.error('❌ User details missing:', response);
          this.errorMessage = 'User details not found. Please log in again.';
          return;
        }
        
        this.userId = response.id;
        this.username = response.name;
        
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
  
    this.http.get<EventItem[]>(`http://127.0.0.1:5000/api/user-registrations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      response => {
        console.log('✅ Raw Registered Events Response:', response);
  
        if (!response || response.length === 0) {
          console.warn('⚠ No events found for the user.');
          this.registeredEvents = [];
        } else {
          this.registeredEvents = response.map(eventReg => {
            console.log('📌 Individual Event:', eventReg);  // Debug each event
  
            return {
              event_id: eventReg.event_id,
              event_name: eventReg.event_name,  // Ensure it assigns event_name
              date: eventReg.date,
              location: eventReg.location,
              description: eventReg.description,
              ticket_type: eventReg.ticket_type,
              ticket_quantity: eventReg.ticket_quantity,
              payment_method: eventReg.payment_method,
              verification_code: eventReg.verification_code
            };
          });
  
          console.log('✅ Mapped Events:', this.registeredEvents);  // Debug final mapped array
        }
      },
      error => {
        console.error('❌ Error fetching registered events:', error);
        this.errorMessage = 'Error loading registered events.';
      }
    );
  }
  
}
