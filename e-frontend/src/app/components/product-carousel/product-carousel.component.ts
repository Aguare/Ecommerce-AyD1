import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// SplideJs
import Splide from '@splidejs/splide';
import { Product } from '../simple-carousel/simple-carousel.component';

//My Imports

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

   products: Product[] = []
   checkUser = false;

  ngOnInit(): void {
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
