import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar-guest',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-guest.component.html',
  styleUrl: './navbar-guest.component.scss'
})
export class NavbarGuestComponent {

    showButtonsRegister = true;
    navbarActive: boolean = false;

    constructor(
      private _router: Router,
      private _localStorage: LocalStorageService,
      private _cookieService: CookieService
    ) { }

    ngOnInit() {
      const url = this._router.url;
      const userId = this._localStorage.getUserId();
      this.showButtonsRegister = userId ? false : true;
      this.showButtonsRegister = !url.includes('verify-email');
      const token = this._cookieService.get('token');
      if (userId && token) {
        this._router.navigate(['/products/init']);
      }
    }

    toggleNavbar() {
      this.navbarActive = !this.navbarActive;
    }
}
