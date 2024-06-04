import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EmailService } from '../../services/email.service';  
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

var otpTemp = 8888;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(
    private userService: UserService, 
    private emailService: EmailService,
    private router: Router, 
    private toastr: ToastrService
  ) {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      confirmPassword: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required, Validators.maxLength(4)])
    });
  }

  signupValidator(field: string): boolean {
    const control = this.signUpForm.get(field);
    return !control?.valid && !control?.pristine;
  }

  sendOTP() {

    const email = this.signUpForm.value.email;
    console.log(email);
    if (!email) {
      this.toastr.error('Por favor ingrese un correo electrónico válido.');
      return;
    }

    this.emailService.sendEmail(email).subscribe({
      next: (response: any) => {
        otpTemp = parseInt(response.verificationCode, 10);
        otpTemp = response.verificationCode;
        this.toastr.success('Código OTP enviado. Por favor revisa tu correo electrónico.', 'Éxito');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al enviar OTP:', error);
        this.toastr.error('Error al enviar OTP. Por favor, intenta nuevamente.', 'Error');
      }
    });
  }

  signUp(event: any) {

    console.log(event.submitter.value);
    if (event.submitter.value === '1'){
      this.sendOTP();
      return;
    }


    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    } else if (this.signUpForm.invalid) {
      this.toastr.error('Completa todos los campos');
      return;
    }

    if (otpTemp != this.signUpForm.value.code) {
      console.log(this.signUpForm.value.code);
      this.toastr.error('OTP es invalido');
      return;
    }

    const user: User = {
      username: this.signUpForm.value.username ?? '',
      password: this.signUpForm.value.password ?? '',
      email: this.signUpForm.value.email ?? ''
    }

    this.userService.signUp(user)
      .subscribe({
        next: (response: any) => {
          console.log('Sign up successful:', response);
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
