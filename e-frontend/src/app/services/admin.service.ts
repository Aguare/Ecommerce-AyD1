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

  private apiUrl = 'http://localhost:3001/admin';

  constructor(private http: HttpClient) { }

  getPages(id: number): Observable<PagesResponse> {

    return this.http.post<PagesResponse>(`${this.apiUrl}/getPages`, { id });
  }
}
