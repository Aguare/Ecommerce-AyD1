import { AfterViewInit, Component, OnInit } from '@angular/core';

// Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interfaces';
import { productos } from '../../db';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements AfterViewInit, OnInit {

   productos: Producto[] = []

  ngOnInit(): void {
    this.productos = productos;
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        autoplay: true,
      }).mount();
    }
  }
}
