import { AfterViewInit, Component } from '@angular/core';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../simple-carousel/simple-carousel.component';
import Splide from '@splidejs/splide';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ImagePipe } from '../../pipes/image.pipe';
import { ProductCardComponent } from '../product-card/product-card.component';


export interface ProductCart {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-category-carrousell',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    ImagePipe,
    ProductCardComponent,
  ],
  templateUrl: './category-carrousell.component.html',
  styleUrl: './category-carrousell.component.scss',
})
export class CategoryCarrousellComponent implements AfterViewInit {
  products: Product[] = [];
  productsCart: ProductCart[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductsWithCategory().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.productsCart = this.groupByCategory(this.products);
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }


  ngAfterViewInit(): void {
    setTimeout(()=>{
      if (typeof document !== 'undefined') {
        this.productsCart.forEach((cart) => {         
          const splideId = '#category-carrousel-' + cart.category;
  
          const splide = new Splide(splideId, {
            type: 'loop',
            perPage: 5,
            perMove: 1,
            gap: '10px',
            padding: {
              right: '0',
              left: '0',
            },
            autoplay: true,
            breakpoints: {
              1024: {
                perPage: 3,
                gap: '8px',
              },
              768: {
                perPage: 1,
                gap: '5px',
              },
            },
          });
          splide.mount();
        });
      }

    },500)
  }


  groupByCategory = (products: Product[]): ProductCart[] => {
    const groupedProducts: { [key: string]: ProductCart } = {};

    products.forEach((product) => {
      const { category } = product;

      if (!groupedProducts[category]) {
        groupedProducts[category] = {
          category: category,
          products: [],
        };
      }

      groupedProducts[category].products.push(product);
    });

    return Object.values(groupedProducts);
  };
}
