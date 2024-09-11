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
  @Input() currency = '$';

  constructor(private router: Router) {
    
  }
  ngOnInit(): void {

  }

  navigateToProductDetails(id: number): void {
    this.router.navigate(['/product-details', id]);
  }
}
