import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../components/simple-carousel/simple-carousel.component';
import { Category } from '../components/card-carrousel/card-carrousel.component';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiProduct = 'http://localhost:3004/product';
  private apiCategories = 'http://localhost:3004/categories';
  private apiCustomer = 'http://localhost:3003/customer'; 

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  getProductsForCart(){
    return this.http.post<Product[]>(`${this.apiProduct}/getProductsForCart`,{});
  }
  
  getProductsByCategory(category: string){
    return this.http.post<Product[]>(`${this.apiProduct}/getProductsByCategory`,{category});
  }
  
  getProductsWithCategory(){
    return this.http.get<Product[]>(`${this.apiProduct}/getProductsWithCategory`);
  }
  
  getCategories(){
    return this.http.get<Category[]>(`${this.apiCategories}/getCategories`);
  }
  
  
  // METHODS FOR CUSTOMER CART
  /**
   *  Get the cart of the user
   * @returns 
   */
  getMyCart(): Observable<any> {
    const id_user =  this.localStorageService.getUserId();
    return this.http.post<any>(`${this.apiCustomer}/myCart`, {id_user});
  }

  /** 
   * get currency symbol
   * @returns
   */
  getCurrency(): Observable<any> {
    return this.http.get<any>(`${this.apiCustomer}/getCurrency`);
  }

  /**
   * Add product to cart
   * @param id_product 
   * @param quantity 
   * @returns 
   */

  updateCart(id_product: number, quantity: number): Observable<any> {
    const id_user = this.localStorageService.getUserId();
    return this.http.put<any>(`${this.apiCustomer}/updateCart`, {id_user, id_product, quantity});
  }

  /**
   * Delete cart from user 
   * @returns 
   */
  deleteCart(): Observable<any> {
    const id_user = this.localStorageService.getUserId();
    return this.http.delete<any>(`${this.apiCustomer}/deleteCart/${id_user}`);
  }

  /** get stores available
   * @returns
    */
  getStores(): Observable<any> {
    return this.http.get<any>(`${this.apiCustomer}/getStores`);
  }
  
  /** validate stock of product in branch 
   * @param id_product 
   * @param id_branch
   * 
  */
  validateStock(id_product: number, id_branch: number): Observable<any> {
    return this.http.post<any>(`${this.apiCustomer}/validateStock`, {id_product, id_branch});
  }

  /**
   * validate stock of product in all branches
   * @returns 
   */

  validateStockOnline(id_product:number ): Observable<any> {
    return this.http.get<any>(`${this.apiCustomer}/validateStockOnline/${id_product}`);
  }

  deleteProductCart(id_product: number): Observable<any> {
    const id_user = this.localStorageService.getUserId();
    return this.http.delete<any>(`${this.apiCustomer}/deleteProductCart/${id_user}/${id_product}`);
  }

}

