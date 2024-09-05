import { AfterViewInit, Component, OnInit } from '@angular/core';

import Splide from '@splidejs/splide';
import { ProductService } from '../../services/product.service';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { ImagePipe } from '../../pipes/image.pipe';

export interface Category {
  name: string;
  image: string;
}

@Component({
  selector: 'app-card-carrousel',
  standalone: true,
  imports: [CommonModule, ImagePipe],
  templateUrl: './card-carrousel.component.html',
  styleUrl: './card-carrousel.component.scss',
})
export class CardCarrouselComponent implements OnInit, AfterViewInit {

  categories: Category[] = [];

  constructor(private productService: ProductService) {
    this.productService.getCategories().subscribe({
      next: (res: Category[]) => {
        console.log('categories:', res);
        this.categories = res;
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      new Splide('#image-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '20px',
        padding: {
          right: '10px',
          left: '10px',
        },
        autoplay: true,
        breakpoints: {
          1024: {
            perPage: 2,
          },
          768: {
            perPage: 1,
          },
        },
      }).mount();
    }
  }
}
