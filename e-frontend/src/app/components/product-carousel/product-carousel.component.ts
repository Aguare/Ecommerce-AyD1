import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// SplideJs
import Splide from '@splidejs/splide';

//My Imports
import { Product } from '../../interfaces';
import { products } from '../../db';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements AfterViewInit, OnInit {

   productos: Product[] = []
   checkUser = false;

  ngOnInit(): void {
    this.productos = products;
    this.checkUser = true;
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      new Splide('.splide', {
        type: 'loop',
        perPage: 4,
        perMove:1,
        gap: 0,
        padding: {
          right: 0,
          left: 0
        },
        autoplay: true,
      }).mount();
    }
  }
}
