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

  saveCompanyImage(body: any) : Observable<any> {
    return this.httpClient.post(this.portImage + 'upload/admin', body);
  }
  
  saveProductImage(body: any) : Observable<any> {
    return this.httpClient.post(this.portImage + 'upload/product', body);
  }
  
  getLogoCompany(): Observable<any> {
    return this.httpClient.get(this.portImage + 'company/logo');
  }
}
