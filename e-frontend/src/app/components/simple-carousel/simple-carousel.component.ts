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
  selector: 'app-simple-carousel',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './simple-carousel.component.html',
  styleUrl: './simple-carousel.component.scss',
})
export class SimpleCarouselComponent implements AfterViewInit, OnInit {
  productos: Producto[] = [];
  comprobacionUsuario = false;

  ngOnInit(): void {
    this.productos = productos;
    this.comprobacionUsuario = false;
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      new Splide('#simple-splide', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '0.1px',
        padding: {
          right: '0',
          left: '0',
        },
        autoplay: true,
      }).mount();
    }
  }
}
