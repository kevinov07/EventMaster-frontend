import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20) ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor() {}

  signupValidator(field: string) {
    const control = this.signUpForm.get(field);

    return !control?.valid && !control?.pristine 
  }

  signUp() {
    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const user: User = {
      username: this.signUpForm.value.username ?? '',
      password: this.signUpForm.value.password ?? '',
      email: this.signUpForm.value.email ?? ''
    }

    this.userService.signUp(user)
      .subscribe({
        next: (response) => {
          console.log('Sign up successful:', response)
          this.router.navigate(['/login']);
        },
        error: (e) => {
          console.error('Error signing up:', e); 
          alert('An error occurred while signing up. Please try again.')
        },
        complete: () => console.log('Sign up complete')
    });
  }
}
