import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
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
  registeredEvents: { date: string; event_name: string; location: string; ticket_type: string; ticket_quantity: number }[] = []; // ✅ Fix: Explicit type
  errorMessage: string = '';

  constructor(private coreService: CoreService) {}

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
        console.log('✅ Registered Events:', response);
        this.registeredEvents = response.length ? response : []; // ✅ No type error now
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
  
  
}
