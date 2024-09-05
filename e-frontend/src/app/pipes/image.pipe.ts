import { Pipe, PipeTransform } from '@angular/core';
import { ImageService } from '../services/image.service';

@Pipe({
  name: 'imagePipe',
  standalone: true
})
export class ImagePipe implements PipeTransform {

  constructor(private imageService: ImageService) {}

  transform(imagePath: string): string {
    const port = this.imageService.getPort();
    return `${port}${imagePath}`;
  }

}
