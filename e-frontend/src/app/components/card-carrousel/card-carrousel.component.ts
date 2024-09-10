import { AfterViewInit, Component, OnInit } from '@angular/core';

import Splide from '@splidejs/splide';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ImagePipe } from '../../pipes/image.pipe';

export interface Category {
  id: number
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
    setTimeout(()=>{
      if (typeof document !== 'undefined') {
        new Splide('#image-carousel', {
          type: 'loop',
          perPage: 6,
          perMove: 1,
          gap: '20px',
          padding: {
            right: '10px',
            left: '10px',
          },
          autoplay: true,
          pagination: false,
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
    },500)
  }
}
