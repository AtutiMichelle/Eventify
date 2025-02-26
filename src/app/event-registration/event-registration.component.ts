import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../services/core.service'; 

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],  
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css'],
})
export class EventRegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  verificationCode: string = '';  
  events: any[] = [];
  ticketTypes: any[] = [];
  paymentMethods = ['Mpesa', 'Credit Card', 'PayPal'];
  selectedEvent: any;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient, 
    private coreService: CoreService  
  ) {
    this.registrationForm = this.fb.group({
      selectedEvent: ['', Validators.required],
      ticketType: ['', Validators.required],
      ticketQuantity: ['1', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      specialRequests: [''],
      verificationCode: ['']  
    });

    if (this.router.getCurrentNavigation()?.extras.state?.['event']) {
      this.selectedEvent = this.router.getCurrentNavigation()?.extras.state?.['event'];
      this.registrationForm.patchValue({ selectedEvent: this.selectedEvent.id });
    }
  }

  ngOnInit() {
    this.fetchEvents();
    this.fetchTicketTypes();
  }

  fetchEvents() {
    this.coreService.getEvents().subscribe({
      next: (data) => {
        console.log('✅ Events fetched:', data);
        this.events = data;
        if (this.selectedEvent) {
          this.registrationForm.patchValue({ selectedEvent: this.selectedEvent.id });
        }
      },
      error: (err) => {
        console.error('❌ Error fetching events:', err);
      }
    });
  }

  fetchTicketTypes() {
    this.coreService.getTicketTypes().subscribe({
      next: (data) => {
        console.log('✅ Ticket types fetched:', data);
        this.ticketTypes = data;
      },
      error: (err) => {
        console.error('❌ Error fetching ticket types:', err);
      }
    });
  }

  toggleMode() {  
    console.log('🔄 Toggling mode: Redirecting to user dashboard.');
    this.router.navigate(['/user-dashboard']); // ✅ Added back
  }

  onEventChange(event: Event) {
    const target = event.target as HTMLSelectElement; 
    const selectedEventId = target.value;
    console.log('🔄 Event changed:', selectedEventId);
    this.registrationForm.patchValue({ selectedEvent: selectedEventId });
  }

  onSubmit() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      console.error('❌ Token is missing from local storage!');
      this.errorMessage = 'User is not authenticated!';
      return;
    }

    if (this.registrationForm.invalid) {
      console.error('❌ Form validation failed!');
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formValues = this.registrationForm.value;

    const registrationData = {
      event_id: formValues.selectedEvent,  
      ticket_id: formValues.ticketType,   
      ticket_quantity: formValues.ticketQuantity,
      payment_method: formValues.paymentMethod,
      special_requests: formValues.specialRequests,
      verification_code: formValues.verificationCode  // ✅ Included in API request
    };

    console.log('📤 Sending registration request:', registrationData);

    this.coreService.registerEvent(token, registrationData).subscribe({
      next: (response) => {
        console.log('✅ Registration successful:', response);
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Registration failed:', error);
        this.successMessage = '';
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }  
}
