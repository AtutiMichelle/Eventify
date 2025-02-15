import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CoreService } from '../services/core.service'; 

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
})
export class AuthComponent {
  @ViewChild('container') container!: ElementRef;

  loginData = { name: '', password: '' };
  signupData = { name: '', email: '', password: '' };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private coreService: CoreService) {} 

  toggleMode() {
    this.container.nativeElement.classList.toggle('sign-up-mode');
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    this.coreService.login(this.loginData).subscribe(
      (response) => {
        const token = response.token;
        const usertype = response.usertype;
  
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('name', this.loginData.name);
          localStorage.setItem('usertype', usertype); // Store user type
  
          this.successMessage = 'Login successful!';
          this.errorMessage = '';
  
          setTimeout(() => {
            if (usertype === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/user-dashboard']);
            }
          }, 1000);
        } else {
          this.errorMessage = 'Invalid credentials';
          this.successMessage = '';
        }
      },
      (error) => {
        this.errorMessage = 'Error logging in. Please try again.';
        this.successMessage = '';
      }
    );
  }
  

  onSignup() {
    console.log("📤 Sending signup data:", this.signupData); // Debugging line
  
    this.coreService.signup(this.signupData).subscribe(
      (response) => {
        console.log("✅ Signup Success:", response);
        this.successMessage = "Registration successful! Please log in.";
        this.errorMessage = "";
        localStorage.setItem("auth_token", response.token);
  
        this.signupData = { name: "", email: "", password: "" };
  
        setTimeout(() => {
          this.toggleMode();
        }, 1500);
      },
      (error) => {
        console.error("❌ Signup Error:", error);
        this.errorMessage = "Error registering. Please try again.";
        this.successMessage = "";
      }
    );
  }
  
  fetchUserDetails() {
    this.coreService.fetchUserDetails().subscribe(
      (response) => {
        console.log('User Data:', response);
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Session expired. Please log in again.';
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          this.router.navigate(['/register']); // Redirect to login
        }, 1500);
      }
    );
  }
  
}
