import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../simple-carousel/simple-carousel.component';
import { MatCardModule } from '@angular/material/card';
import { ImagePipe } from '../../pipes/image.pipe';
import { CommonModule, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, ImagePipe, SlicePipe, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  currency = "$";

  constructor(private router: Router, private productService: ProductService) {
    
  }
  ngOnInit(): void {
    this.productService.getCurrency().subscribe((currency: any) => {
      this.currency = currency.data.currency
    });
  }

  navigateToProductDetails(product: Product) {
    console.log('product ', product);
    this.router.navigate(['/product-details', product.id]);
  }
}
