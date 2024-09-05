import { AfterViewInit, Component } from '@angular/core';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../simple-carousel/simple-carousel.component';
import Splide from '@splidejs/splide';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ImagePipePipe } from '../../pipes/image-pipe.pipe';

@Component({
  selector: 'app-category-carrousell',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, ImagePipePipe],
  templateUrl: './category-carrousell.component.html',
  styleUrl: './category-carrousell.component.scss'
})
export class CategoryCarrousellComponent implements AfterViewInit {

  products1: Product[] = []
  products2: Product[] = []
  products3: Product[] = []

  title1 = "Tecnologia"
  title2 = "Hogar"
  title3 = "Academico"

  constructor(private productService: ProductService){}

 ngOnInit(): void {
  this.productService.getProductsByCategory(this.title1).subscribe({
    next: (res: Product[]) => {
      this.products1 = res;  
      this.products1 = this.products1.slice(0,10);          
    },
    error: (err: any) => {
      console.log('Error:', err);
    },
  });
  
  this.productService.getProductsByCategory(this.title2).subscribe({
    next: (res: Product[]) => {
      this.products2 = res;      
      this.products2 = this.products2.slice(0,10);
    },
    error: (err: any) => {
      console.log('Error:', err);
    },
  });
  
  this.productService.getProductsByCategory(this.title3).subscribe({
    next: (res: Product[]) => {
      this.products3 = res;     
      this.products3 = this.products3.slice(0,10); 
    },
    error: (err: any) => {
      console.log('Error:', err);
    },
  });
 }

 ngAfterViewInit(): void {
  if (typeof document !== 'undefined') {
    const splide1 = new Splide('#category-carrousel1', {
      type: 'loop',
      perPage: 4,
      perMove: 1,
      gap: '10px',
      padding: {
        right: '0',
        left: '0',
      },
      autoplay: true,
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

    splide1.mount();
    
    const splide2 = new Splide('#category-carrousel2', {
      type: 'loop',
      perPage: 4,
      perMove: 1,
      gap: '10px',
      padding: {
        right: '0',
        left: '0',
      },
      autoplay: true,
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

    splide2.mount();

    const splide3 = new Splide('#category-carrousel3', {
      type: 'loop',
      perPage: 4,
      perMove: 1,
      gap: '10px',
      padding: {
        right: '0',
        left: '0',
      },
      autoplay: true,
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

    splide3.mount();
  }
 }
}
