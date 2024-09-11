import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../../services/email.service';
import Swal from 'sweetalert2';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NavbarGuestComponent, CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  token: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _emailService: EmailService,
    private _router: Router,
    private _adminService: AdminService
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || '';
    });

    if (!this.token || !this.email) {
      Swal.fire({
        title: 'Error',
        text: 'Este enlace ya no es válido',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      this._router.navigate(['/login']);
    }
  }

  validPasswordLength(): any {
    return this.newPassword.length >= 6 && this.newPassword.length <= 30;
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  canSubmit(): boolean {
    return this.validPasswordLength() && this.passwordsMatch();
  }

  resetPassword(): void {
    if (this.canSubmit()) {
      const data = {
        token: this.token,
        email: this.email,
        password: this.newPassword
      };
      this._adminService.sendResetPasswordEmail(data).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Contraseña cambiada',
            text: 'Tu contraseña ha sido cambiada exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this._router.navigate(['/login']);
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Error',
            text: "Este enlace ya no es válido",
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this._router.navigate(['/login']);
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, verifica que las contraseñas coincidan y tengan los requisitos adecuados.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

}
