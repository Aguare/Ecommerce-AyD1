import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebaMaterialComponent } from "./prueba-material/prueba-material.component";
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { SimpleCarouselComponent } from './components/simple-carousel/simple-carousel.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PruebaMaterialComponent, ProductCarouselComponent, SimpleCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e-frontend';
}
