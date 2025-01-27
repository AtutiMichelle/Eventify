import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-verification',
  templateUrl: './event-verification.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./event-verification.component.css']
})
export class EventVerificationComponent {
  verificationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.verificationForm = this.fb.group({
      verificationCode: ['', Validators.required]  
    });
  }

  onSubmit() {
    const enteredCode = this.verificationForm.value.verificationCode;
    const storedCode = localStorage.getItem('verificationCode');

    if (enteredCode === storedCode) {
      this.successMessage = 'Event successfully verified!';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/user-dashboard']); 
      }, 2000);
    } else {
      this.errorMessage = 'Invalid verification code!';
      this.successMessage = '';
    }
  }
}
