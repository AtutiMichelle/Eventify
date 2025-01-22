import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

interface User {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
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

  constructor(private router: Router) {}

  toggleMode() {
    this.container.nativeElement.classList.toggle('sign-up-mode');
    // Clear messages when toggling
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user
    const user = users.find(
      (u: User) =>
        u.username === this.loginData.username &&
        bcrypt.compareSync(this.loginData.password, u.password)
    );
    const hashedPassword = bcrypt.hashSync(this.signupData.password, 10);
    this.signupData.password = hashedPassword;

    if (user) {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
      // Store logged in user
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Navigate to event registration after successful login
      setTimeout(() => {
        this.router.navigate(['/event-registration']);
      }, 1000);
    } else {
      this.errorMessage = 'Invalid username or password';
      this.successMessage = '';
    }
  }

  onSignup() {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if username already exists
    if (users.some((u: User) => u.username === this.signupData.username)) {
      this.errorMessage = 'Username already exists';
      this.successMessage = '';
      return;
    }

    // Check if email already exists
    if (users.some((u: User) => u.email === this.signupData.email)) {
      this.errorMessage = 'Email already exists';
      this.successMessage = '';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.successMessage = '';
      return;
    }

    // Validate password length
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      this.successMessage = '';
      return;
    }

    // Hash the password before storing
    const hashedPassword = bcrypt.hashSync(this.signupData.password, 10);
    this.signupData.password = hashedPassword;

    // Add new user
    users.push(this.signupData);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    this.successMessage = 'Registration successful! Please login.';
    this.errorMessage = '';

    // Clear form
    this.signupData = {
      username: '',
      email: '',
      password: '',
    };

    // Switch to login mode after successful registration
    setTimeout(() => {
      this.toggleMode();
    }, 1500);
  }
}
