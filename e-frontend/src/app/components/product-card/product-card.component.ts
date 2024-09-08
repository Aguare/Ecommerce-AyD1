import { Component, Input } from '@angular/core';
import { Product } from '../simple-carousel/simple-carousel.component';
import { MatCardModule } from '@angular/material/card';
import { ImagePipe } from '../../pipes/image.pipe';
import { CommonModule, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, ImagePipe, SlicePipe, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) {
    
  }

  navigateToProductDetails(product: Product) {
    console.log('product ', product);
    this.router.navigate(['/product-details', product.id]);
  }
}
