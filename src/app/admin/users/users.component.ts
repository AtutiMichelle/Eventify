import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule,SidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})


export class UsersComponent  {
  
}