import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableComponent } from './table/table.component';
import { Color,ScaleType } from '@swimlane/ngx-charts';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, SidebarComponent, NgxChartsModule, TableComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  faUser = faUser;
  faBell = faBell;
  faTachometerAlt = faTachometerAlt;
  faCalendarAlt = faCalendarAlt;
  faEdit = faEdit;
  faSignOutAlt = faSignOutAlt;
  faMagnifyingGlass = faMagnifyingGlass;

  username: string = '';
  userId: number | null = null;
  registeredEvents: { date: string; event_name: string; location: string; ticket_type: string; ticket_quantity: number }[] = [];
  errorMessage: string = '';

  totalUsers: number = 0;
  totalEvents: number = 0;
  totalRegisteredEvents: number = 0;
  recentUsers: any[] = [];
  cancelledEvents: any[] = [];
  tableColumns = ['id', 'user_name', 'event_name', 'reason', 'cancelled_at'];

  canceledRegistrations: any[] = [];
  tableColumnsRecentUsers: string[] = ['Name', 'Email', 'Date Joined'];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,  
    domain: ['#1E89DA', '#AA4DF0', '#B0C4B1']
  };
  


  // ✅ Donut Chart Data (Now Empty - Will Be Populated Dynamically)
  public donutChartData: any[] = [];

  public donutChartOptions = {
    "isDoughnut": true,
    "gradient": false
  };

  constructor(private coreService: CoreService) {}

  ngOnInit() {
    this.fetchDashboardStats();
    this.fetchRecentUsers();
    this.fetchTicketSalesDistribution(); 
    this.loadCanceledRegistrations();

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
        this.registeredEvents = response.length ? response : [];
      },
      error => {
        console.error('❌ Error loading events:', error);
        this.errorMessage = 'Error loading registered events.';
      }
    );
  }

  logout(event: Event) {
    event.preventDefault();
    this.coreService.logout();
    window.location.href = '../';
  }

  fetchDashboardStats() {
    this.coreService.getDashboardStats().subscribe(data => {
      this.totalUsers = data.totalUsers;
      this.totalEvents = data.totalEvents;
      this.totalRegisteredEvents = data.totalRegisteredEvents;
    });
  }

  fetchRecentUsers() {
    this.coreService.getRecentUsers().subscribe(users => {
      this.recentUsers = users.slice(0, 5);
    });
  }

  

  // ✅ Fetch Ticket Sales Data and Update Donut Chart
  fetchTicketSalesDistribution() {
    this.coreService.getTicketSalesDistribution().subscribe({
      next: (data) => {
        this.donutChartData = data; // Update the chart with dynamic data
        console.log('✅ Ticket Sales Data:', this.donutChartData);
        console.log('Color scheme:',this.colorScheme)
      },
      error: (err) => {
        console.error('❌ Error loading ticket sales data:', err);
      }
    });
  }

  loadCanceledRegistrations() {
    this.coreService.getCanceledRegistrations().subscribe(
      response => {
        console.log('✅ Raw API Response:', response);  // Debugging
  
        this.canceledRegistrations = response.map(reg => ({
          id: reg.registration_id ?? 'N/A',  
          user_name: reg.user_name || 'Unknown',  
          event_name: reg.event_name && reg.event_name.trim() ? reg.event_name : 'N/A',  
          reason: reg.cancellation_reason || 'N/A',  
          cancelled_at: reg.cancelled_at ? new Date(reg.cancelled_at).toLocaleString() : 'N/A'
        }));
        
        console.log('✅ Processed Canceled Registrations:', this.canceledRegistrations);
        
      },
      error => {
        console.error('❌ Error loading canceled registrations:', error);
      }
    );
  }
  
}

