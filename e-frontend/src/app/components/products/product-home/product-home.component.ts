import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from '../../category-carrousell/category-carrousell.component';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ImageCarrousellComponent } from "../../image-carrousell/image-carrousell.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { SimpleCarouselComponent } from '../../simple-carousel/simple-carousel.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule, 
    ImageCarrousellComponent, 
    NavbarComponent, 
    CardCarrouselComponent, 
    CategoryCarrousellComponent, 
    MatProgressSpinnerModule, 
    ImageCarrousellComponent,
    SimpleCarouselComponent
  ],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {

  spinner = true;

  homeImages: string[] = [
    'img/carrousell/carrousell-1.jpg',
    'img/carrousell/carrousell-2.jpg',
    'img/carrousell/carrousell-3.jpg',
    'img/carrousell/carrousell-4.jpg',
    'img/carrousell/carrousell-5.jpg',
  ]
  
  constructor(private productService: ProductService) { }

  ngOnInit() {
    setTimeout(() => {
      this.spinner = false;
    },700)

    this.productService.updateViewsLogged.subscribe(() =>{
      this.ngOnInit();
    });
  }

}
