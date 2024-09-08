import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

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
      private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
      const url = this._router.url;
      this.showButtonsRegister = !this.localStorageService.getUserId() && url !== '/login';
    }

    toggleNavbar() {
      this.navbarActive = !this.navbarActive;
    }
}
