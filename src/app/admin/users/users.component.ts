import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../services/core.service';
import { Router } from '@angular/router'; // 🚀 Import Router for navigation
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, SidebarComponent, TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  columns: string[] = ['ID', 'Name', 'Email', 'Date Joined'];
  errorMessage: string = '';
  searchQuery: string = '';

  constructor(private coreService: CoreService, private router: Router) {} // 🚀 Inject Router

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.coreService.getAllUsers().subscribe({
      next: (response) => {
        console.log('Users:', response);
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
        this.users = []; // ⚠️ This line clears users on error
      }
    });
  }
  

  searchUsers() {
    if (!this.searchQuery.trim()) {
      this.fetchUserDetails();
      return;
    }

    this.coreService.searchUsers(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Search Results:', response);
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response) {
          this.users = [response];
        } else {
          this.users = [];
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
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.coreService.deleteUser(userId).subscribe({
        next: () => {
          console.log(`✅ User with ID ${userId} deleted successfully.`);
          this.fetchUserDetails();
        },
        error: (err) => {
          console.error('❌ Error deleting user:', err);
          this.errorMessage = 'Error deleting user';
        }
      });
    }
  }
}
