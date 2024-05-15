import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userService: UserService = inject(UserService);

  constructor() { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })


  loginValidator(field: string) {
    const control = this.loginForm.get(field);

    return !control?.valid && !control?.pristine;
  }
  // updateUsername(event: any) {
  //   this.username.setValue(event.target.value);
  // }

  // updatePassword(event: any) {
  //   this.password.setValue(event.target.value);
  // }

  login() {
    // if (this.loginForm.value.password !== this.loginForm.value.confirmPassword) {
    //   alert('Passwords do not match');
    //   return;
    // }

    const user: User = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? ''
    }

    //this.userService.login(user)
    // console.log('Logging in with username:', this.username.value, 'and password:', this
    // .password.value);
    
  }

}
