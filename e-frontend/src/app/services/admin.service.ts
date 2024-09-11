import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../interfaces';

export interface Page {
  id: number;
  pageName: string;
  direction: string;
  isAvailable: number;
  moduleName: string;
}

export interface PagesResponse {
  result: Page[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiAdmin = 'http://localhost:3001/admin';
  private apiUsers = 'http://localhost:3001/users';
  private apiCustomers = 'http://localhost:3003/customer';
  private apiLogin = 'http://localhost:3001';
  private apiSettings = 'http://localhost:3001/settings';
  

  constructor(private http: HttpClient) { }

  getPages(id: number): Observable<PagesResponse> {
    return this.http.get<PagesResponse>(`${this.apiAdmin}/getPages/${id}`);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiLogin}/login`, data);
  }

  updateUserInformation(data: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUsers}/user/information/${id}`, data);
  }

  getUserInformation(username: string): Observable<any> {
    return this.http.get(`${this.apiUsers}/user/information/${username}`);
  }

  getUserImageProfile(id: number) : Observable<any> {
    return this.http.get(`${this.apiUsers}/user/image/${id}`)
  }
  
  register = (data: any): Observable<any> => {
    return this.http.post(`${this.apiCustomers}/sign-up`, data);
  }

  getSettings(name: string) : Observable<any> {
    return this.http.get(`${this.apiSettings}/find/${name}`);
  }

  getTabs() : Observable<any> {
    return this.http.get(`${this.apiSettings}/tabs`);
  }

  updateSettings(body: any) : Observable<any> {
    return this.http.put(`${this.apiSettings}/update`, body)
  }

  /**
   * save employee information, and add new user
   * 
   */
  saveEmployeeInformation(data: any): Observable<any> {
    return this.http.post(`${this.apiAdmin}/addEmployee`, data);
  }

  /**
   * get roles from employee
   */
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiAdmin}/getRoles`);
  }
}

