import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 

interface EventItem {
  id: number;
  name: string;
  date: string;
  type: string;
  amount: string;
  user:string;
}

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css'] 
})
export class EventRegistrationComponent {
  registrationForm: FormGroup;
  successMessage:string='';
  errorMessage:string='';

  events = [
    { id: 1, name: 'Tech Conference 2024' },
    { id: 2, name: 'Business Summit' },
    { id: 3, name: 'Art Exhibition' }
  ];

  registerEvent(){
    localStorage.setItem('registeredEvent', JSON.stringify(this.events))
  }
  constructor(private fb: FormBuilder, private router:Router) {
    // Initialize the form with default values and validation rules
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],  // First Name is required
      lastName: ['', Validators.required],   // Last Name is required
      email: ['', [Validators.required, Validators.email]],  // Email is required and must be a valid email
      selectedEvent: ['', Validators.required]  // Event selection is required
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {

      const currentUser = localStorage.getItem('username');

      if(!currentUser){
        this.errorMessage='User not logged in!';
        return;
      }

      const selectedEventId = this.registrationForm.value.selectedEvent;

      const selectedEvent = this.events.find(event => event.id === +selectedEventId);

    if (!selectedEvent) {
      this.errorMessage = 'Invalid event selected!';
      return;
    }

      // Create an event object from the form values
      const registeredEvent: EventItem = {
        id: Date.now(), 
        name: selectedEvent.name, 
        date: new Date().toISOString().split('T')[0], // Current date
        type: 'General', 
        amount: '$100.00' ,
        user:currentUser
      };

      // Store the registered event in local storage
      const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      registeredEvents.push(registeredEvent);
      localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));

      this.successMessage='Event registered successfully'
      this.errorMessage=''

      console.log('Event registered:', registeredEvent); // Debugging line
      setTimeout(() => {
        this.router.navigate(['/user-dashboard']); // Navigate to the user dashboard
      }, 2000); // Delay for 2 seconds to show the success message
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.'; // Set error message
      this.successMessage = ''; 
    }
    } 
  }

