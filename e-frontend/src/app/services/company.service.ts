import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiCompany = 'http://localhost:3005/company';

  constructor(private httpClient: HttpClient) { }

  getSettings(name: string) : Observable<any> {
    return this.httpClient.get(`${this.apiCompany}/settings/${name}`);
  }

  getTabs() : Observable<any> {
    return this.httpClient.get(`${this.apiCompany}/tabs`);
  }

  updateSettings(name: string, value: string) : Observable<any> {
    return this.httpClient.put(`${this.apiCompany}/settings`, {name, value});
  }
}
