import { AfterViewInit, Component } from '@angular/core';

import Splide from '@splidejs/splide';

@Component({
  selector: 'app-card-carrousel',
  standalone: true,
  imports: [],
  templateUrl: './card-carrousel.component.html',
  styleUrl: './card-carrousel.component.scss'
})
export class CardCarrouselComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    if( typeof document !== 'undefined' ) {
      new Splide('#image-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '20px',
        padding: {
          right: '10px',
          left: '10px',
        },
        autoplay: true,
        breakpoints: {
          1024: {
            perPage: 2,
          },
          768: {
            perPage: 1,
          },
        },
      }).mount();
    }
  }
}
