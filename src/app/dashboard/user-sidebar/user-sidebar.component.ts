import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faDrupal } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-user-sidebar',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})


export class UserSidebarComponent implements OnInit {
  faUser = faUser;
  faBell = faBell;
  faTachometerAlt = faTachometerAlt;
  faCalendarAlt = faCalendarAlt;
  faEdit = faEdit;
  faSignOutAlt = faSignOutAlt;
  faMagnifyingGlass = faMagnifyingGlass;
  faDrupal = faDrupal;


  username: string = '';
  userId: number | null = null;
  errorMessage:string='';
  

  constructor(private coreService: CoreService) {}

  ngOnInit() {
    this.coreService.getUserDetails().subscribe(
      response => {
        console.log('✅ User Details:', response);
        if (!response || !response.id) {
          this.errorMessage = 'User details not found. Please log in again.';
          return;
        }
        this.userId = response.id;
        this.username = response.name;
        // this.loadRegisteredEvents();
      },
      error => {
        console.error('❌ Error fetching user details:', error);
        this.errorMessage = 'Error fetching user details. Please log in again.';
      }
    );
  }
  logout(event: Event) {
    event.preventDefault(); 
    this.coreService.logout(); 
    window.location.href = '../'; 
  }
  }
