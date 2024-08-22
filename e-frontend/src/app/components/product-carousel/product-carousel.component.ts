import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';

//Mis Importaciones
import { Producto } from '../../interfaces';
import { productos } from '../../db';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements AfterViewInit, OnInit {

   productos: Producto[] = []
   comprobacionUsuario = false;

  ngOnInit(): void {
    this.productos = productos;
    this.comprobacionUsuario = false;
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
