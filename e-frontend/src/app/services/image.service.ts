import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  portImage: string = 'http://localhost:3002/';

  constructor() { }

  getPort(){
    return this.portImage;
  }
}
