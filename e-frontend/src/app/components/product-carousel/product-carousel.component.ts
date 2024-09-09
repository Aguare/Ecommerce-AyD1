import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// SplideJs
import Splide from '@splidejs/splide';
import { Product } from '../simple-carousel/simple-carousel.component';
import { ProductService } from '../../services/product.service';

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
   currency = "$";

  constructor(private productService: ProductService){}

  ngOnInit(): void {

    this.productService.getCurrency().subscribe((currency: any) => {
      console.log(currency);
      this.currency = currency.data.currency
    });

    this.productService.getProductsForCart().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        
        // this.products.forEach(pr => {
        //   pr.image_path = `C:/Users/oscar/OneDrive/Desktop/Git/Ecommerce-AyD1/e-backend/msImg/${pr.image_path}`
        //   console.log(pr.image_path);
          
        // })
        
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      const splide1 = new Splide('#product-carrousel', {
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
    }
  }
}
