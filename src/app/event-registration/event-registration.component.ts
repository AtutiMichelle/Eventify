import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';



// interface EventItem {
//   id: number;
//   name: string;
//   date: string;
//   type: string;
//   amount: string;
//   user:string;
//   verificationCode:string;
// }

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
  verificationCode: string = '';

  events = [
    { id: 1, name: 'Tech Conference 2024' },
    { id: 2, name: 'Business Summit' },
    { id: 3, name: 'Art Exhibition' }
  ];

  ticketTypes =['General', 'VIP', 'Student'];
  paymentMethods=['Mpesa', 'Credit Card', 'PayPal'];

  // registerEvent(){
  //   localStorage.setItem('registeredEvent', JSON.stringify(this.events))
  // }
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    // Initialize the form with validation rules
    this.registrationForm = this.fb.group({
      selectedEvent: ['', Validators.required],
      ticketType: ['', Validators.required],
      ticketQuantity: ['1', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      specialRequests: ['']
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const token = localStorage.getItem('auth_token');
  
      if (!token) {
        this.errorMessage = 'User authentication token not found. Please log in again.';
        return;
      }
  
      // ✅ Fetch logged-in user details from Node.js backend
      this.http.get<any>('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (response) => {
          console.log('✅ User API Response:', response);
  
          if (!response || !response.user_id) {
            console.error('❌ User details missing:', response);
            this.errorMessage = 'User details not found. Please log in again.';
            return;
          }
  
          const userId = response.user_id; 
          console.log('User ID:', userId);
  
          const registrationData = {
            user_id: userId,
            event_id: this.registrationForm.value.selectedEvent,
            ticket_type: this.registrationForm.value.ticketType,
            ticket_quantity: this.registrationForm.value.ticketQuantity,
            payment_method: this.registrationForm.value.paymentMethod,
            special_requests: this.registrationForm.value.specialRequests
          };
  
          console.log('🚀 Sending Registration Data:', registrationData);
  
          const headers = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          });
  
          // ✅ Send event registration request to Node.js backend
          this.http.post<any>('http://localhost:5000/api/register-event', registrationData, { headers }).subscribe({
            next: (response) => {
              console.log('✅ Registration API Response:', response);
              this.successMessage = 'Event registered successfully!';
              this.errorMessage = '';
              this.verificationCode = response.verification_code || '';
  
              setTimeout(() => {
                this.router.navigate(['/user-dashboard']);
              }, 3000);
            },
            error: (error) => {
              console.error('❌ API Error:', error);
              this.errorMessage = error.error.message || 'Error registering event. Please try again.';
              this.successMessage = '';
            }
          });
  
        },
        (error) => {
          console.error('❌ User API Error:', error);
          this.errorMessage = 'Error fetching user details. Please log in again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = '';
    }
  }
  
}
     //const currentUser = localStorage.getItem('username');

    //   if(!currentUser){
    //     this.errorMessage='User not logged in!';
    //     return;
    //   }

    //   const selectedEventId = this.registrationForm.value.selectedEvent;

    //   const selectedEvent = this.events.find(event => event.id === +selectedEventId);

    // if (!selectedEvent) {
    //   this.errorMessage = 'Invalid event selected!';
    //   return;
    // }

    //   const verificationCode=Math.floor(Math.random()*1000000).toString();
    //   // Create an event object from the form values
    //   const registeredEvent: EventItem = {
    //     id: Date.now(), 
    //     name: selectedEvent.name, 
    //     date: new Date().toISOString().split('T')[0], // Current date
    //     type: 'General', 
    //     amount: '$100.00' ,
    //     user:currentUser,
    //     verificationCode: verificationCode
    //   };

    //   // Store the registered event in local storage
    //   const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    //   registeredEvents.push(registeredEvent);
    //   localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));

    //   localStorage.setItem('verificationCode', verificationCode)

    //   this.successMessage='Event registered successfully'
    //   this.errorMessage=''

    //   console.log('Event registered:', registeredEvent); // Debugging line
    //   setTimeout(() => {
    //     this.router.navigate(['/user-dashboard']); // Navigate to the user dashboard
    //   }, 2000); // Delay for 2 seconds to show the success message
    // } else {
    //   this.errorMessage = 'Please fill in all required fields correctly.'; // Set error message
    //   this.successMessage = ''; 
    // }
      
    
    
    
    
  
  
  

