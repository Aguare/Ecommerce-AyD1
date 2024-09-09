import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import Splide from '@splidejs/splide';
import { ImagePipe } from '../../pipes/image.pipe';


@Component({
  selector: 'app-image-carrousell',
  standalone: true,
  imports: [CommonModule, ImagePipe],
  templateUrl: './image-carrousell.component.html',
  styleUrl: './image-carrousell.component.scss',
})
export class ImageCarrousellComponent implements AfterViewInit {

  @Input() images!: string[];

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
