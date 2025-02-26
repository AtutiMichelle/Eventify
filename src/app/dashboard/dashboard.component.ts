import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { CancelEventDialogComponent } from './cancel-event-dialog/cancel-event-dialog.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { TableComponent } from '../admin/table/table.component';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule,UserSidebarComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  faUser = faUser;
  faBell = faBell;
  faTachometerAlt = faTachometerAlt;
  faCalendarAlt = faCalendarAlt;
  faEdit = faEdit;
  faSignOutAlt = faSignOutAlt;
  faMagnifyingGlass = faMagnifyingGlass;


  username: string = '';
  userId: number | null = null;
  registeredEvents: {id: number; date: string; event_name: string; location: string; ticket_type: string; ticket_quantity: number }[] = []; // ✅ Fix: Explicit type
  errorMessage: string = '';

  tableColumns = ['date', 'event_name', 'location', 'ticket_type', 'ticket_quantity'];

  constructor(private coreService: CoreService, private dialog: MatDialog) {}

  ngOnInit() {
    this.coreService.getUserDetails().subscribe(
      response => {
        console.log('✅ User Details:', response);
        if (!response || !response.id) {
          this.errorMessage = 'User details not found. Please log in again.';
          return;
        }
        this.userId = response.id;
        this.username = response.name;
        this.loadRegisteredEvents();
      },
      error => {
        console.error('❌ Error fetching user details:', error);
        this.errorMessage = 'Error fetching user details. Please log in again.';
      }
    );

    
  }

  loadRegisteredEvents() {
    if (!this.userId) return;

    this.coreService.getRegisteredEvents().subscribe(
      response => {
        console.log('✅ Raw API Response:', response); // 🔹 Debug the response

        if (!response || !Array.isArray(response)) {
            console.error("❌ Error: Invalid response format", response);
            this.errorMessage = 'Error loading registered events.';
            return;
        }

        // 🔹 Ensure each event has an ID
        this.registeredEvents = response.map(event => {
            if (!event.registration_id) {
                console.error("❌ Missing ID in event:", event); // Debug log for missing IDs
            }

            return {
                id: event.registration_id ?? null, // ✅ Ensure ID is correctly extracted
                date: event.date ?? 'N/A',
                event_name: event.event_name ?? 'Unknown Event',
                location: event.location ?? 'Not Specified',
                ticket_type: event.ticket_type ?? 'General',
                ticket_quantity: event.ticket_quantity ?? 1
            };
        });

        console.log('✅ Processed Registered Events:', this.registeredEvents);
      },
      error => {
        console.error('❌ Error loading events:', error);
        this.errorMessage = 'Error loading registered events.';
      }
    );
}


  logout(event: Event) {
    event.preventDefault(); // Prevent the default anchor behavior
    this.coreService.logout(); // Clear the token
    window.location.href = '../'; // Redirect to login page
  }

  cancelRegistration(id: number) {
    if (!id) {
      console.error("❌ Error: id is undefined before sending request");
      return;
    }
  
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;
  
    console.log("📡 Sending to API:", { id, reason });
  
    this.coreService.cancelRegistration(id, reason).subscribe({
      next: () => {
        alert("✅ Registration cancelled successfully!");
        this.registeredEvents = this.registeredEvents.filter(event => event.id !== id);
      },
      error: err => {
        console.error("❌ Error cancelling registration:", err);
        alert("❌ Failed to cancel registration: " + err.message);
      }
    });
  }
  
}
