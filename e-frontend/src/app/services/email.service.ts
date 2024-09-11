import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiEmail = 'http://localhost:3005/email';

  constructor(private http: HttpClient) { }

  verifyEmailUser(data: any): any {
    return this.http.post(`${this.apiEmail}/verify-email`, data);
  }

  sendVerificationEmail(data: any): any {
    return this.http.post(`${this.apiEmail}/sendVerificationEmail`, data);
  }

  sendRecoveryPasswordEmail(data: any): any {
    return this.http.post(`${this.apiEmail}/sendRecoveryPasswordEmail`, data);
  }

  validateEmail(data: any): any {
    return this.http.post(`${this.apiEmail}/validateEmail`, data);
  }
}
