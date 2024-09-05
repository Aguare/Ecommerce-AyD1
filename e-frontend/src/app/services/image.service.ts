import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  PORT: number = 3002;
  DOMAIN: string = `http://localhost:${this.PORT}`;
  upload: string = `${this.DOMAIN}/upload`;

  constructor(private httpClient: HttpClient) { }

  getPort(){
    return this.DOMAIN;
  }

  saveClientImage(image: any) : Observable<any> {
    return this.httpClient.post(this.upload + '/client', image);
  }

  saveClientImage(image: any) : Observable<any> {
    return this.httpClient.post(this.portImage + 'upload/client', image);
  }

  saveCompanyImage(body: any) : Observable<any> {
    return this.httpClient.post(this.portImage + 'upload/admin', body);
  }
}
