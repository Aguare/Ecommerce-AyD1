import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';

//Mis Importaciones
import { Product } from '../../interfaces';
import { products } from '../../db';

@Component({
  selector: 'app-simple-carousel',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './simple-carousel.component.html',
  styleUrl: './simple-carousel.component.scss',
})
export class SimpleCarouselComponent implements AfterViewInit, OnInit {
  products: Product[] = [];
  comprobacionUsuario = false;

  ngOnInit(): void {
    this.products = products;
    this.comprobacionUsuario = false;
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      const splide = new Splide('#simple-splide', {
        type: 'loop',
        perPage: 3, // Por defecto en pantallas grandes
        perMove: 1,
        gap: '10px',
        padding: {
          right: '0',
          left: '0',
        },
        autoplay: true,
        breakpoints: {
          1024: {
            perPage: 2, // 2 tarjetas en pantallas medianas
            gap: '8px',
          },
          768: {
            perPage: 1, // 1 tarjeta en pantallas pequeñas
            gap: '5px',
          },
        },
      });
  
      splide.mount();
    }
  }
  
}
