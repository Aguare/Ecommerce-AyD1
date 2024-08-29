import { Component } from '@angular/core';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { SimpleCarouselComponent } from '../../simple-carousel/simple-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCarouselComponent, SimpleCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
