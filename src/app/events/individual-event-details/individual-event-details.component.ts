import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../services/core.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-individual-event-details',
  templateUrl: './individual-event-details.component.html',
  styleUrls: ['./individual-event-details.component.css'],
  imports: [CommonModule],
  providers: [DatePipe], 
})
export class IndividualEventDetailsComponent implements OnInit {
  event: any;
  loading: boolean = true; // Loading state
  errorMessage: string = ''; // To handle errors
  
  constructor(
    private route: ActivatedRoute,
    private coreService: CoreService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');  // Get the 'id' parameter from the URL

    if (id) {
      // Convert the id from string to number
      const eventId = Number(id);
      
      if (isNaN(eventId)) {
        this.errorMessage = 'Invalid event ID';
        this.loading = false;
      } else {
        this.fetchEventDetails(eventId);  // Pass the numeric ID to the method
      }
    } else {
      this.errorMessage = 'Event ID not found!';
      this.loading = false;
    }
  }

  fetchEventDetails(eventId: number) {
    this.coreService.getEventById(eventId).subscribe(
      (response) => {
        if (response) {
          console.log('✅ Event details:', response);  // Log the event data
          this.event = response;
          this.loading = false;
        } else {
          this.errorMessage = 'Event data not found.';
          this.loading = false;
        }
      },
      (error) => {
        console.error('❌ Error fetching event:', error);
        this.loading = false;  
        this.errorMessage = 'Could not fetch event details. Please try again later.';
      }
    );
  }
  

  registerForEvent() {
    if (this.event) {
      this.router.navigate(['/event-registration'], { state: { event: this.event } });
    }
  }
}
