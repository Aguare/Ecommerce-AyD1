import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NavbarGuestComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{

  isLogged: boolean = false;

  constructor(private localStorageService: LocalStorageService) {
    
  }
  ngOnInit(): void {
    const userId = this.localStorageService.getUserId();
    this.isLogged = userId ? true : false;
  }
}
