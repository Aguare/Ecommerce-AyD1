import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from '../../category-carrousell/category-carrousell.component';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardCarrouselComponent, CategoryCarrousellComponent, MatProgressSpinnerModule],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {

  spinner = true;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.spinner = false;
    },700)    
  }

}
