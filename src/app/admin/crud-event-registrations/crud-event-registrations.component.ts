import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { TableComponent } from '../table/table.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-crud-event-registrations',
  templateUrl: './crud-event-registrations.component.html',
  styleUrls: ['./crud-event-registrations.component.css'],
  imports:[TableComponent,SidebarComponent]
})
export class CrudEventRegistrationsComponent implements OnInit {
  columns = ['id', 'ticket_quantity', 'payment_method', 'verification_code', 'created_at', 'user_name', 'event_name', 'ticket_name'];
  data: any[] = [];
  searchQuery: string = '';

  constructor(private coreService: CoreService) {}

  ngOnInit() {
    this.fetchEventRegistrations();
  }

  fetchEventRegistrations() {
    this.coreService.getEventRegistrations().subscribe({
      next: (registrations) => {
        this.data = registrations;
      },
      error: (err) => console.error('Error fetching event registrations:', err)
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.coreService.searchEventRegistrations(query).subscribe({
      next: (filteredData) => {
        this.data = filteredData;
      },
      error: (err) => console.error('Error searching event registrations:', err)
    });
  }

  onEdit(updatedData: any) {
    this.coreService.updateEventRegistration(updatedData.id, updatedData).subscribe({
      next: () => {
        this.fetchEventRegistrations(); // Refresh data
      },
      error: (err) => console.error('Error updating event registration:', err)
    });
  }

  onDelete(id: number) {
    this.coreService.deleteEventRegistration(id).subscribe({
      next: () => {
        this.data = this.data.filter(reg => reg.id !== id); // Remove from UI
      },
      error: (err) => console.error('Error deleting event registration:', err)
    });
  }
}
