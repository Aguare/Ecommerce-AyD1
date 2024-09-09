import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';

//Mis Importaciones
import { ProductService } from '../../services/product.service';
import { ImagePipe } from '../../pipes/image.pipe';

export interface Product {
  id: number
  name: string;
  description: string;
  price: number;
  image_path: string;
  category: string;
  discount: number;
  brand: string;
}

@Component({
  selector: 'app-simple-carousel',
  standalone: true,
  imports: [CommonModule, MatCardModule, ImagePipe],
  templateUrl: './simple-carousel.component.html',
  styleUrl: './simple-carousel.component.scss',
})
export class SimpleCarouselComponent implements AfterViewInit, OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.productService.getProductsForCart().subscribe({
      next: (res: Product[]) => {
        this.products = res;       
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const splide = new Splide('#simple-splide', {
          type: 'loop',
          perPage: 3,
          perMove: 1,
          gap: '0',
          padding: {
            right: '0',
            left: '0',
          },
          autoplay: true,
          pagination: false,
          breakpoints: {
            1024: {
              perPage: 2, 
              gap: '8px',
            },
            768: {
              perPage: 1, 
              gap: '5px',
            },
          },
        });
    
        splide.mount();
      }
    }, 500)
  }
  
}
