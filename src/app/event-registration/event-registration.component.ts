import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css'] 
})
export class EventRegistrationComponent {
  registrationForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  verificationCode: string = '';
  

  // events = [
  //   { id: 1, name: 'Tech Conference 2024' },
  //   { id: 2, name: 'Business Summit' },
  //   { id: 3, name: 'Art Exhibition' }
  // ];

  // ticketTypes = [
  //   { id: 101, type: 'General' },
  //   { id: 102, type: 'VIP' },
  //   { id: 103, type: 'Student' }
  // ];

  events: any[]=[];
  ticketTypes: any[]=[];

  paymentMethods = ['Mpesa', 'Credit Card', 'PayPal'];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      selectedEvent: ['', Validators.required],
      ticketType: ['', Validators.required],
      ticketQuantity: ['1', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      specialRequests:['']
    });
  }

  ngOnInit(){
    this.fetchEvents();
    this.fetchTicketTypes();
  }
  onEventChange(event: any) {
    const selectedEventId = event.target.value;
    console.log('Selected Event ID:', selectedEventId);  // Debugging line
    // if (selectedEventId) {
    //   this.fetchTicketTypes();
    // }
  }
  
  
//i think the error occurs here so whats the problem?
fetchEvents() {
  this.http.get<any[]>('http://localhost:5000/api/event-details').subscribe({
    next: (data) => {
      console.log('Events fetched:', data); // Check the fetched data
      this.events = data;
    },
    error: (err) => {
      console.error('Error fetching events:', err);
    }
  });
}

fetchTicketTypes() {
  this.http.get<any[]>(`http://localhost:5000/api/tickets/ticket-types`).subscribe({
    next: (data) => {
      console.log('Ticket types fetched:', data); // Debugging line
      this.ticketTypes = data;
    },
    error: (err) => {
      console.error('Error fetching ticket types:', err); // Debugging line
    }
  });
}

  onSubmit() {
    if (this.registrationForm.valid) {
      const token = localStorage.getItem('auth_token');
  
      if (!token) {
        this.errorMessage = 'User authentication token not found. Please log in again.';
        return;
      }
  
      // ✅ Fetch logged-in user details
      this.http.get<any>('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (response) => {
          console.log("User details response:", response); // Debugging
  
          if (!response || typeof response !== 'object' || !response.id) {
            this.errorMessage = 'User details not found. Please log in again.';
            return;
          }
  
          const userId = response.id;
          const selectedEventId = this.registrationForm.value.selectedEvent;
          const selectedTicketId = this.registrationForm.value.ticketType;
          const ticketQuantity = this.registrationForm.value.ticketQuantity;

          const selectedTicket = this.ticketTypes.find(ticket => ticket.id == this.registrationForm.value.ticketType);


          if(!selectedTicket){
            this.errorMessage='Invalid ticket type selected.';
            return;
          }
  
          const registrationData = {
            user_id: userId,
            event_id: selectedEventId,
            ticket_id: selectedTicketId, // ✅ Using ID correctly
            ticket_quantity: ticketQuantity,
            payment_method: this.registrationForm.value.paymentMethod,
            special_requests: this.registrationForm.value.specialRequests || null
            
          };
  
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          });
  
          // ✅ Send event registration request
          this.http.post<any>('http://localhost:5000/api/register-event', registrationData, { headers }).subscribe({
            next: (response) => {
              console.log("Registration response:", response); // Debugging
              this.successMessage = 'Event registered successfully!';
              this.errorMessage = '';
              this.verificationCode = response.verification_code || 'N/A';
              
              localStorage.setItem('verificationCode', this.verificationCode);
  
              setTimeout(() => {
                this.router.navigate(['/user-dashboard']);
              }, 3000);
            },
            error: (error) => {
              console.error("Registration error:", error); // Debugging
              this.errorMessage = error.error?.message || 'Error registering event. Please try again.';
              this.successMessage = '';
            }
          });
  
        },
        (error) => {
          console.error("User details fetch error:", error); // Debugging
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
      
    
    
    
    
  
  
  

