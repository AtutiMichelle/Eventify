import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

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

  constructor(private router: Router, private authService: AuthService) {} 

  toggleMode() {
    this.container.nativeElement.classList.toggle('sign-up-mode');
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    this.authService.login(this.loginData).subscribe(
      (response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('name', this.loginData.name);
          this.successMessage = 'Login successful!';
          this.errorMessage = '';

          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
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
  
    this.authService.signup(this.signupData).subscribe(
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
    this.authService.fetchUserDetails().subscribe(
      (response) => {
        console.log('User Data:', response);
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'User not authenticated. Please log in again.';
      }
    );
  }
}
