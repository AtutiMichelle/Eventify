import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, SidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
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
  registeredEvents: { date: string; event_name: string; location: string; ticket_type: string; ticket_quantity: number }[] = []; // ✅ Fix: Explicit type
  errorMessage: string = '';

  totalUsers: number=0;
  totalEvents:number=0;
  totalRegisteredEvents: number=0;
  recentUsers:any[]=[];

  constructor(private coreService: CoreService) {}

  ngOnInit() {
    
    this.fetchDashboardStats();
    this.fetchRecentUsers();
    
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

  fetchDashboardStats(){
    this.coreService.getDashboardStats().subscribe(data=>{
      this.totalUsers=data.totalUsers;
      this.totalEvents=data.totalEvents;
      this.totalRegisteredEvents=data.totalRegisteredEvents;
    });

  }

  fetchRecentUsers(){
    this.coreService.getRecentUsers().subscribe(users=>{
      this.recentUsers=users.slice(0,5);
    });
  }  
}
