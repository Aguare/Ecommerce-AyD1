import { AfterViewInit, Component } from '@angular/core';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-image-carrousell',
  standalone: true,
  imports: [],
  templateUrl: './image-carrousell.component.html',
  styleUrl: './image-carrousell.component.scss',
})
export class ImageCarrousellComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const splideId = '#image-carrousell';
        const splide = new Splide(splideId, {
          type       : 'fade',
  heightRatio: 0.5,
  pagination : false,
  cover      : true,
        });
        splide.mount();
      }
    }, 500);
  }
}
