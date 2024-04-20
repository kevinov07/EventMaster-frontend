import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = new FormControl('');
  password = new FormControl('');
  constructor() { }

  updateUsername(event: any) {
    this.username.setValue(event.target.value);
  }

  updatePassword(event: any) {
    this.password.setValue(event.target.value);
  }

  login() {
    console.log('Logging in with username:', this.username.value, 'and password:', this
    .password.value);
    
  }

}
