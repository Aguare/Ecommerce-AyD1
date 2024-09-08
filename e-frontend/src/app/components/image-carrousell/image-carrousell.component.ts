import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Splide from '@splidejs/splide';

interface ImageForCarrousell {
  path: string;
  alt: string;
}

@Component({
  selector: 'app-image-carrousell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carrousell.component.html',
  styleUrl: './image-carrousell.component.scss',
})
export class ImageCarrousellComponent implements AfterViewInit {

  images: ImageForCarrousell[] = [
    {
      path: '/carrousell-1.jpg',
      alt: 'Image to Carrousell 1'
    },
    {
      path: '/carrousell-2.jpg',
      alt: 'Image to Carrousell 2'
    },
    {
      path: '/carrousell-3.jpg',
      alt: 'Image to Carrousell 3'
    },
    {
      path: '/carrousell-4.jpg',
      alt: 'Image to Carrousell 4'
    },
    {
      path: '/carrousell-5.jpg',
      alt: 'Image to Carrousell 5'
    },
  ]

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const splideId = '#image-carrousell';
        const splide = new Splide(splideId, {
          type: 'loop',
          heightRatio: 0.5,
          pagination: false,
          cover: true,   
          
        });
        splide.mount();
      }
    }, 500);
  }
}
