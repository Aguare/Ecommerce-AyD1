import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AdminService, Page, PagesResponse } from '../../../services/admin.service';
import { CookieService } from 'ngx-cookie-service';
import { ImagePipe } from '../../../pipes/image.pipe';
import { LocalStorageService } from '../../../services/local-storage.service';

interface MenuItem {
  module: string;
  pages: PageItem[]
}

interface PageItem {
  pageName: string;
  direction: string;
  isAvailable: number
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, ImagePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [CookieService]
})
export class NavbarComponent implements OnInit {

  isClient = true;
  pages: Page[] = [];
  pagesNavBar: MenuItem[] = [];
  userName: any;
  userId: any;
  userImage: string = '';
  isActive: boolean = false;
  activeModule: string | null = null;

  constructor(
    private adminService: AdminService,
    private _router: Router,
    private _cookieService: CookieService,
    private _localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userId = this._localStorage.getUserId();
    this.userName = this._localStorage.getUserName();

    // Function to get pages of user by his id
    this.adminService.getPages(this.userId).subscribe({
      next: (res: PagesResponse) => {
        this.pages = res.result;
        this.pagesNavBar = this.groupPagesByModule(this.pages);
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });


    const photo = this._localStorage.getUserPhoto();

    if (!photo) {
      this.adminService.getUserImageProfile(this.userId).subscribe({
        next: (res: any) => {
          this.userImage = res.imageProfile;
          this._localStorage.setUserPhoto(res.imageProfile);
        }
      });
      return;
    }

    this.userImage = photo;
  }


/**
 * Method to convert pages to navbarMenu
 * @param pages
 * @returns
 */
  groupPagesByModule(pages: Page[]): MenuItem[] {
    const groupedPages: { [key: string]: PageItem[] } = {};

    pages.forEach((page) => {
      if (!groupedPages[page.moduleName]) {
        groupedPages[page.moduleName] = [];
      }
      groupedPages[page.moduleName].push({
        pageName: page.pageName,
        direction: page.direction,
        isAvailable: page.isAvailable,
      });
    });

    return Object.keys(groupedPages).map((moduleName) => ({
      module: moduleName,
      pages: groupedPages[moduleName],
    }));
  }

  logout() {
    this._localStorage.clear();
    this._cookieService.delete('token');
    this._router.navigate(['/home']);
  }

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  toggleSubmenu(module: string) {
    this.activeModule = this.activeModule === module ? null : module;
  }

  myAccount() {
    this._router.navigate([`/account/${this.userName}`]);
  }

}
