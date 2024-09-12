import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiReports = 'http://localhost:3006/reports';

  constructor(
    private http: HttpClient
  ) { }

  getListReports(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiReports}/listReports`, data);
  }

}
