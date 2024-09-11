import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { EmailService } from '../../../services/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarGuestComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private _emailService: EmailService,
    private _router: Router
  ) { }

  validEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  canSubmit(): boolean {
    return this.validEmail();
  }

  validateEmail(): void {
    if (!this.validEmail()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } else {
      this._emailService.validateEmail({ email: this.email }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sendRecoveryEmail();
          } else {
            Swal.fire({
              title: 'Error',
              text: 'El correo electrónico ingresado no está registrado.',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        },
        error: (error: any) => {
          if (error.status === 500) {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al validar el correo electrónico. Por favor, intenta de nuevo.',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'El correo electrónico ingresado no está registrado.',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    }
  }

  sendRecoveryEmail(): void {
    if (this.canSubmit()) {
      this._emailService.sendRecoveryPasswordEmail({ email: this.email }).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Correo de recuperación enviado',
            text: 'Por favor, revisa tu correo para continuar con el proceso de recuperación.',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this._router.navigate(['/login']);
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al enviar el correo de recuperación. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }
}
