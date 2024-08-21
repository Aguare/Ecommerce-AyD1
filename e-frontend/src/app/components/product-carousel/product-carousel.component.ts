import { AfterViewInit, Component } from '@angular/core';

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
export class ProductCarouselComponent implements AfterViewInit {
  products = [
    {
      nombre: 'Smartwatch Deportivo',
      imagen: 'https://d2j6dbq0eux0bg.cloudfront.net/images/29501524/4100185208.png',
      precio: 120.99,
      descuento: 10,
      descripcion:
        'Reloj inteligente con GPS integrado, monitor de frecuencia cardíaca y resistencia al agua.',
    },
    {
      nombre: 'Auriculares Inalámbricos Bluetooth',
      imagen: 'https://www.radioshackla.com/media/catalog/product/4/5/454791500018_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700',
      precio: 49.99,
      descuento: 0,
      descripcion:
        'Auriculares con cancelación de ruido y hasta 12 horas de duración de batería.',
    },
    {
      nombre: 'Mochila Impermeable para Laptop',
      imagen: 'https://cdn.pacifiko.com/image/cache/catalog/p/ZjUxNDQ0OW_1-484x484.png',
      precio: 39.99,
      descuento: 5,
      descripcion:
        'Mochila resistente al agua, con compartimento acolchado para laptops de hasta 15.6 pulgadas.',
    },
    {
      nombre: 'Cámara de Acción 4K',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9jcy23pKKPa4Tf1g2qRaHglvCN0WSIBqkqQ&s',
      precio: 89.99,
      descuento: 15,
      descripcion:
        'Cámara de acción con grabación en 4K, estabilización de imagen y carcasa sumergible.',
    },
    {
      nombre: 'Botella de Agua Reutilizable',
      imagen: 'https://media.revistavanityfair.es/photos/614d10324ced078586562e25/1:1/w_1156,h_1156,c_limit/258360.png',
      precio: 14.99,
      descuento: 0,
      descripcion:
        'Botella de acero inoxidable con capacidad de 1 litro, apta para bebidas frías y calientes.',
    },
  ];

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
