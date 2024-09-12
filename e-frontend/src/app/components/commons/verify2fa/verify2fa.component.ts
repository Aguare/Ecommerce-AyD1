import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify2fa',
  standalone: true,
  imports: [],
  templateUrl: './verify2fa.component.html',
  styleUrl: './verify2fa.component.scss'
})
export class Verify2faComponent {

  constructor(
    private _adminService: AdminService,
    private _localStorageService: LocalStorageService,
    private _router: Router
  ) { }

  moveNext(event: any, nextFieldId: string): void {
    const input = event.target;
    const value = input.value;

    if (event.inputType === 'insertFromPaste' && value.length > 1) {
      const digits = value.split('');

      const inputs = document.getElementsByClassName('code-input');
      for (let i = 0; i < digits.length && i < inputs.length; i++) {
        (inputs[i] as HTMLInputElement).value = digits[i];
      }

      (inputs[Math.min(digits.length, inputs.length - 1)] as HTMLInputElement).focus();
      return;
    }

    if (value.length === 1 && nextFieldId) {
      const nextField = document.getElementById(nextFieldId) as HTMLInputElement;
      if (nextField) {
        nextField.focus();
      }
    }
  }

  verifyCode(): void {
    const code = [
      (document.getElementById('digit1') as HTMLInputElement).value,
      (document.getElementById('digit2') as HTMLInputElement).value,
      (document.getElementById('digit3') as HTMLInputElement).value,
      (document.getElementById('digit4') as HTMLInputElement).value,
      (document.getElementById('digit5') as HTMLInputElement).value,
      (document.getElementById('digit6') as HTMLInputElement).value,
    ].join('');

    if (code.length !== 6) {
      Swal.fire({
        title: 'Error',
        text: 'El código debe tener 6 dígitos',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const id = this._localStorageService.getUserId();

    this._adminService.validateCode2FA({ id: id, code: code }).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Éxito',
          text: 'Código correcto',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setTimeout(() => {
          this._router.navigate(['/products/init']);
        }, 500);

      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Código incorrecto',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        this._localStorageService.logout();
        this._router.navigate(['/login']);
      }
    });
  }

}
