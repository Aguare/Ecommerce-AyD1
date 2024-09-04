import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from '../../category-carrousell/category-carrousell.component';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [NavbarComponent, CardCarrouselComponent, CategoryCarrousellComponent, ProductCarouselComponent],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    
  }

}
