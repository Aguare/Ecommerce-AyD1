import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  getPages(id: number): Observable<PagesResponse> {
    return this.http.post<PagesResponse>(`${this.apiAdmin}/getPages`, { id });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUsers}/login`, data);
  }

  register = (data: any): Observable<any> => {
    console.log(data);
    return this.http.post(`${this.apiCustomers}/sign-up`, data);
  }
}
