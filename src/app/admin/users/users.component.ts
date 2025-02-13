import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../../services/core.service'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBell, faTachometerAlt, faCalendarAlt, faEdit, faSignOutAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { response } from 'express';

@Component({
  selector: 'app-user',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule,SidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})


export class UsersComponent implements OnInit {
  users:any[]=[];
  errorMessage:string='';

  constructor(private coreService:CoreService){}

    ngOnInit(){
      this.fetchUserDetails();

    }

      fetchUserDetails(){
        this.coreService.getAllUsers().subscribe({
          next:(response)=>{
            console.log('Users',response);
            if(Array.isArray(response)){
              this.users=response;
            }else {
              console.error('❌ Expected an array but got:', response);
              this.users = []; // Set to an empty array to prevent errors
            }
          },
          error:(err)=>{
            console.error('Error fetching users',err);
            this.errorMessage='Error fetching user details';
          }

        });
      }
    }
