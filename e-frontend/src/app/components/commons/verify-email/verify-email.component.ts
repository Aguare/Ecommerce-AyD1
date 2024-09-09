import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../../services/email.service';
import Swal from 'sweetalert2';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [NavbarGuestComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

  token: string = '';
  email: string = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _emailService: EmailService,
    private _router: Router
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || '';
    });
  }

  verifyEmail(): void {
    this._emailService.verifyEmailUser({ token: this.token, email: this.email }).subscribe({
      next: (res: any) => {
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
  }

}
