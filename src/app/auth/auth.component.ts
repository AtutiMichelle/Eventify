import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
})
export class AuthComponent {
  @ViewChild('container') container!: ElementRef;

  loginData = {
    username: '',
    password: '',
  };

  signupData = {
    username: '',
    email: '',
    password: '',
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  toggleMode() {
    this.container.nativeElement.classList.toggle('sign-up-mode');
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * ✅ Function to get authorization headers with Bearer token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      })
    };
  }

  onLogin() {
    const loginData = {
      name: this.loginData.username,
      password: this.loginData.password,
    };

    this.http.post<any>('http://127.0.0.1:8000/api/login', loginData).subscribe(
      (response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('username', this.loginData.username);
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
    const signupData = {
      name: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password,
    };

    this.http.post<any>('http://127.0.0.1:8000/api/register', signupData).subscribe(
      (response) => {
        if (response.token) {
          this.successMessage = 'Registration successful! Please login';
          this.errorMessage = '';
          localStorage.setItem('auth_token', response.token);

          this.signupData = {
            username: '',
            email: '',
            password: '',
          };

          setTimeout(() => {
            this.toggleMode();
          }, 1500);
        } else {
          this.errorMessage = 'Registration failed. Please try again';
          this.successMessage = '';
        }
      },
      (error) => {
        this.errorMessage = 'Error registering. Please try again';
        this.successMessage = '';
      }
    );
  }

  /**
   * ✅ Function to fetch user details using the stored token
   */
  fetchUserDetails() {
    this.http.get<any>('http://127.0.0.1:8000/api/user', this.getAuthHeaders()).subscribe(
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
