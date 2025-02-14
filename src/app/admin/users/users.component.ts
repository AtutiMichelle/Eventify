import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../services/core.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, SidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  searchQuery: string = ''; // Holds the search input

  constructor(private coreService: CoreService) {}

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.coreService.getAllUsers().subscribe({
      next: (response) => {
        console.log('Users', response);
        if (Array.isArray(response)) {
          this.users = response;
        } else {
          console.error('❌ Expected an array but got:', response);
          this.users = [];
        }
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.errorMessage = 'Error fetching user details';
      }
    });
  }

  searchUsers() {
    if (!this.searchQuery.trim()) {
      this.fetchUserDetails(); // Reset to all users if search is empty
      return;
    }

    this.coreService.searchUsers(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Search Results:', response);
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response) {
          this.users = [response]; // ✅ Convert single object to an array
        } else {
          this.users = []; // Handle empty response
        }
        
      },
      error: (err) => {
        console.error('Error searching users', err);
        this.errorMessage = 'Error fetching search results';
      }
    });
  }

  updateUser(user: any) {
    console.log('Editing user:', user);
    // Open a modal or navigate to an edit page
  }
  
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.coreService.deleteUser(userId).subscribe({
        next: () => {
          console.log(`✅ User with ID ${userId} deleted successfully.`);
          this.fetchUserDetails(); // Refresh user list
        },
        error: (err) => {
          console.error('❌ Error deleting user:', err);
          this.errorMessage = 'Error deleting user';
        }
      });
    }
  }
  
}
