import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../components/simple-carousel/simple-carousel.component';
import { Category } from '../components/card-carrousel/card-carrousel.component';
import { LocalStorageService } from './local-storage.service';
import { ProductDetail } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  updateViews = new EventEmitter();
  updateViewsLogged = new EventEmitter();
  private apiProduct = 'http://localhost:3004/product';
  private apiCategories = 'http://localhost:3004/categories';
  private apiCustomer = 'http://localhost:3003/customer'; 

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  getProductsForCart(){
    let branchId = this.localStorageService.getBranchId();
    if(!this.localStorageService.getBranchId()){
     branchId = 2;
    }
    return this.http.get<Product[]>(`${this.apiProduct}/getProductsForCart/${branchId}`);
  }
  
  getProductsByCategory(category: string){
    const id_branch = this.localStorageService.getBranchId();
    return this.http.post<Product[]>(`${this.apiProduct}/getProductsByCategory`,{category, id_branch});
  
  }
  
  getProductsWithCategory(){
    const id_branch = this.localStorageService.getBranchId();
    return this.http.get<Product[]>(`${this.apiProduct}/getProductsWithCategory/${id_branch}`);
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

  /**
   * get Product by id
   * @param id
   * @returns
   */

  getProductById(id: any): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiProduct}/getProductById/${id}`);
  }

  getStockProductById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiProduct}/getStockProductById/${id}`);
  }

  addProductToCart(id_user: number, id_branch:number, id_product: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiCustomer}/addProductCart`, {id_user, id_product, id_branch, quantity});
  }

  getBranchesWithProduct() {
    return this.http.get<any>(`${this.apiProduct}/getBranchesWithProduct`);
  }

  getNumberInCart(): Observable<any> {
    const id_user = this.localStorageService.getUserId();
    return this.http.get<any>(`${this.apiCustomer}/getNumberInCart/${id_user}`);
  }
}

