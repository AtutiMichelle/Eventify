import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { EventRegistrationService } from '../services/event-registration.service'; // Import the service

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],  // ✅ Ensure this is present
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css'],
})
export class EventRegistrationComponent {
  registrationForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  verificationCode: string = '';
  events: any[] = [];
  ticketTypes: any[] = [];
  paymentMethods = ['Mpesa', 'Credit Card', 'PayPal'];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient, 
    private eventRegistrationService: EventRegistrationService  // ✅ Use the new service
  ) {
    this.registrationForm = this.fb.group({
      selectedEvent: ['', Validators.required],
      ticketType: ['', Validators.required],
      ticketQuantity: ['1', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      specialRequests: ['']
    });
  }

  ngOnInit() {
    this.fetchEvents();
    this.fetchTicketTypes();
  }

  fetchEvents() {
    this.eventRegistrationService.getEvents().subscribe({
      next: (data) => {
        console.log('Events fetched:', data);
        this.events = data;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

    fetchTicketTypes() {
    this.eventRegistrationService.getTicketTypes().subscribe({
      next: (data) => {
        console.log('Ticket types fetched:', data);
        this.ticketTypes = data;
      },
      error: (err) => {
        console.error('Error fetching ticket types:', err);
      }
    });
  }

  onEventChange(event: Event) {
    const target = event.target as HTMLSelectElement; // ✅ Ensure correct type casting
    const selectedEventId = target.value;

  }
  onSubmit() {
    const token = localStorage.getItem('auth_token');
  
    if (!token) {
      console.error('❌ Token is missing from local storage!');
      this.errorMessage = 'User is not authenticated!';
      return;
    }
  
    const formValues = this.registrationForm.value;
  
    // ✅ Ensure correct field names for API
    const registrationData = {
      event_id: formValues.selectedEvent,  
      ticket_id: formValues.ticketType,   
      ticket_quantity: formValues.ticketQuantity,
      payment_method: formValues.paymentMethod,
      special_requests: formValues.specialRequests
    };
  
    console.log('📤 Sending registration request:', registrationData);
  
    this.eventRegistrationService.registerEvent(token, registrationData).subscribe({
      next: (response) => {
        console.log('✅ Registration successful:', response);
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Registration failed:', error);
        this.successMessage = '';
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
  
}

