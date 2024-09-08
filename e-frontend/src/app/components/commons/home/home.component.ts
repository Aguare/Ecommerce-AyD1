import { AfterViewInit, Component } from '@angular/core';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { SimpleCarouselComponent } from '../../simple-carousel/simple-carousel.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from "../../category-carrousell/category-carrousell.component";
import { ImageCarrousellComponent } from "../../image-carrousell/image-carrousell.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ImageCarrousellComponent, SimpleCarouselComponent, NavbarGuestComponent, CardCarrouselComponent, CategoryCarrousellComponent, ImageCarrousellComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  
}
