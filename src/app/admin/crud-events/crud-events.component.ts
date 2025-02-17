import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-crud-events',
  imports: [SidebarComponent, TableComponent],
  templateUrl: './crud-events.component.html',
  styleUrl: './crud-events.component.css'
})
export class CRUDEventsComponent implements OnInit {
  columns: string[] = ['ID', 'Name', 'Date', 'Time', 'Location', 'Organizer', 'Capacity', 'Status'];
  events: any[] = [];
  filteredEvents: any[]=[];
  errorMessage: string = '';

  constructor(private coreService: CoreService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.coreService.getEvents().subscribe((data) => {
      this.events = data;
      this.filteredEvents=data;
    });
  }

  onSearch(query: string) {
    if (!query.trim()) {
      this.loadEvents(); 
      return;
    }

    this.coreService.searchEvents(query).subscribe({
      next: (response) => {
        console.log('Search Results:', response);
        if (Array.isArray(response)) {
          this.filteredEvents = [...response];
          this.cdr.detectChanges();
        } else {
          this.filteredEvents = [];
        }
      },
      error: (err) => {
        console.error('Error searching users', err);
        this.errorMessage = 'Error fetching search results';
      }
    });
  
  }
  onEdit(event: any) {
    this.coreService.updateEvent(event.id, event).subscribe(() => {
      this.loadEvents();
    });
  }

  onDelete(eventId: number) {
    this.coreService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents();
    });
  }
}
