import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EmailService } from '../../services/email.service';  
import { Recover } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { empty } from 'rxjs';

var otpTemp = -1;
var sent = false;

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPassword {
  recoverForm: FormGroup;

  constructor(
    private userService: UserService, 
    private emailService: EmailService,
    private router: Router, 
    private toastr: ToastrService
  ) {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      confirmPassword: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required, Validators.maxLength(4)])
    });
  }

  signupValidator(field: string): boolean {
    const control = this.recoverForm.get(field);
    return !control?.valid && !control?.pristine;
  }

  sendOTP() {

    const email = this.recoverForm.value.email;
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

  recoverPassword(event: any) {

    console.log(event.submitter.value);
    if (event.submitter.value === '1'){
      sent = true;
      this.sendOTP();
      return;
    }

    if (this.recoverForm.value.password !== this.recoverForm.value.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    } else if (this.recoverForm.invalid) {
      this.toastr.error('Completa todos los campos');
      return;
    }


    if (this.recoverForm.value.password !== this.recoverForm.value.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    } else if (this.recoverForm.invalid) {
      this.toastr.error('Completa todos los campos');
      return;
    }

    if (otpTemp != this.recoverForm.value.code || sent === false) {
      console.log(this.recoverForm.value.code);
      if(sent === false) this.toastr.error('Solicita el numero otp');
      else this.toastr.error('OTP es invalido');
      return;
    }

    const recoverPass: Recover = {
      password: this.recoverForm.value.password ?? '',
      email: this.recoverForm.value.email ?? ''
    }

    this.userService.recoverPasswordByEmail(recoverPass)
      .subscribe({
        next: (response: any) => {
          console.log('Contraseña cambiada:', response);
          this.toastr.success('Contraseña cambiada por favor inicie sesion.', 'Success!');
          this.router.navigate(['/login']);
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error signing up:', e);
          e.error.message
            ? this.toastr.error(e.error.message, 'Error')
            : this.toastr.error('Ha ocurrido un error.', 'Error');
        },
        complete: () => console.log('Contraseña cambiada')
      });
  }
}
