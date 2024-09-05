import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  portImage: string = 'http://localhost:3002/';

  constructor(private httpClient: HttpClient) { }

  getPort(){
    return this.portImage;
  }

  saveClientImage(image: any) : Observable<any> {
    return this.httpClient.post(this.portImage + 'upload/client', image);
  }
}
