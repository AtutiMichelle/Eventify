import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css'] // Corrected to styleUrls
})
export class EventRegistrationComponent {
  registrationForm: FormGroup;
  events = [
    { id: 1, name: 'Tech Conference 2024' },
    { id: 2, name: 'Business Summit' },
    { id: 3, name: 'Art Exhibition' }
  ];

  constructor(private fb: FormBuilder) {
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
      // Handle form submission logic (e.g., sending the data to a backend)
      console.log('Form submitted:', this.registrationForm.value);
    } else {
      // Optional: Display an alert or message if the form is invalid
      console.log('Form is invalid');
    }
  }
}
