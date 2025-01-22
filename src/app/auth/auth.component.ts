import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css'],
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

  toggleMode() {
    this.container.nativeElement.classList.toggle('sign-up-mode');
  }

  onLogin() {
    console.log('Login:', this.loginData);
  }

  onSignup() {
    console.log('Signup:', this.signupData);
  }
}
