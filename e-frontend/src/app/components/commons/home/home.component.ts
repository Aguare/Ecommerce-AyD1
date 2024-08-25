import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, NavbarGuestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
