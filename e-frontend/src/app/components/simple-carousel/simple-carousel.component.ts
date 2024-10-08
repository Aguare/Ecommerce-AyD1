import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';

// SplideJs
import Splide from '@splidejs/splide';

//Mis Importaciones
import { ProductService } from '../../services/product.service';
import { ImagePipe } from '../../pipes/image.pipe';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { CurrencyPipe } from '../../pipes/currency.pipe';

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
  imports: [CommonModule, MatCardModule, ImagePipe, CurrencyPipe],
  templateUrl: './simple-carousel.component.html',
  styleUrl: './simple-carousel.component.scss',
})
export class SimpleCarouselComponent implements AfterViewInit, OnInit {
  products: Product[] = [];
  currency = "$";

  constructor(
    private productService: ProductService,
    private router: Router,
    private _localStorage: LocalStorageService
  ){}

  ngOnInit(): void {
    const branchId = this._localStorage.getBranchId();

    if(!branchId) {
      this.productService.getBranchesWithProduct().subscribe((res: any) => {
        this._localStorage.setBranchId(res[0].id);
        this._localStorage.setBranchName(res[0].name);
        this._localStorage.setBranchAddress(res[0].address);
      });
    }
    this.productService.getCurrency().subscribe((currency: any) => {
      this.currency = currency.data.currency
    });

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
  

  navigateToProductDetails(product: Product) {
    console.log('product ', product);
    this.router.navigate(['/product-details', product.id]);
  }
}
