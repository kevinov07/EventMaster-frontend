import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;


  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      identifier: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })

   }


  loginValidator(field: string) {
    const control = this.loginForm.get(field);

    return !control?.valid && !control?.pristine;
  }

  login() {

    if (this.loginForm.invalid) {
      this.toastr.error('Please fill out all fields correctly.');
      console.log('Please fill out all fields correctly.');
      return;
    }

    const user: User = {
      username: '',
      password: this.loginForm.value.password ?? '',
      email: '',
      identifier: this.loginForm.value.identifier ?? ''
    }

    this.userService.login(user)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.toastr.success('Login successful.', 'Success!');
          this.router.navigate(['/dashboard']);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

        },
        error: (e) => {
          console.error('Error logging in:', e);
          e.error.message
            ? this.toastr.error(e.error.message, 'Error')
            : this.toastr.error('An error occurred. Please try again.', 'Error');
        }
      });
    
  }

}
