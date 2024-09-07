import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  USER_ID = 'id_user';
  USER_NAME = 'name_user';
  USER_PHOTO = 'photo_user';
  COMPANY_LOGO = 'company_logo';
  COMPANY_NAME = 'company_name';

  constructor() { }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  setItem(key: string, value: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string): any {
    if (this.isLocalStorageAvailable()) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }

  getUserId(): number {
    return this.getItem(this.USER_ID);
  }

  getUserName(): string {
    return this.getItem(this.USER_NAME);
  }

  getCompanyLogo(): string {
    return this.getItem(this.COMPANY_LOGO);
  }

  getCompanyName(): string {
    return this.getItem(this.COMPANY_NAME);
  }

  getUserPhoto(): string {
    return this.getItem(this.USER_PHOTO);
  }

  setUserPhoto(photo: string): void {
    this.setItem(this.USER_PHOTO, photo);
  }

  setUserId(id: number): void {
    this.setItem(this.USER_ID, id);
  }

  setUserName(name: string): void {
    this.setItem(this.USER_NAME, name);
  }

  setCompanyLogo(logo: string): void {
    this.setItem(this.COMPANY_LOGO, logo);
  }

  setCompanyName(name: string): void {
    this.setItem(this.COMPANY_NAME, name);
  }
}
