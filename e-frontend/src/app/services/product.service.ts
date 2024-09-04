import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../components/simple-carousel/simple-carousel.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiProduct = 'http://localhost:3004/product';

  constructor(private http: HttpClient) { }

  getProductsForCart(){
    return this.http.post<Product[]>(`${this.apiProduct}/getProductsForCart`,{});
  }
  
  getProductsByCategory(category: string){
    return this.http.post<Product[]>(`${this.apiProduct}/getProductsByCategory`,{category});
  }
}
