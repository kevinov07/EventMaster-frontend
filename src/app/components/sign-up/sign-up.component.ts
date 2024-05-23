import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20) ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  signupValidator(field: string) {
    const control = this.signUpForm.get(field);

    return !control?.valid && !control?.pristine 
  }

  signUp() {
    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    } else if (this.signUpForm.invalid) {
      this.toastr.error('Please fill out all fields correctly.');
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
          this.toastr.success('Sign up successful. Please log in.', 'Success!');
          this.router.navigate(['/login']);
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error signing up:', e); 
          e.error.message
            ? this.toastr.error(e.error.message, 'Error') 
            : this.toastr.error('An error occurred while signing up. Please try again.', 'Error');
        },
        complete: () => console.log('Sign up complete')
    });
  }
}
