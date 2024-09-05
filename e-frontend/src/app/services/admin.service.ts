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

  updateUserInformation(data: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUsers}/user/information/${id}`, data);
  }

  getUserInformation(username: string): Observable<any> {
    return this.http.get(`${this.apiUsers}/user/information/${username}`);
  }

  getUserImageProfile(id: number) : Observable<any> {
    return this.http.get(`${this.apiUsers}/user/image/${id}`);
  }
<<<<<<< HEAD
  
  register = (data: any): Observable<any> => {
    console.log(data);
    return this.http.post(`${this.apiCustomers}/sign-up`, data);
  }
=======
>>>>>>> 17f0cb5 (Fixing bug, rename categories directory, adding profile image to navbar)
}
