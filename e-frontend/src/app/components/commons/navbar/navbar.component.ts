import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AdminService, Page, PagesResponse } from '../../../services/admin.service';
import { CookieService } from 'ngx-cookie-service';

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
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [CookieService]
})
export class NavbarComponent implements OnInit {

  isClient = true;
  pages: Page[] = [];
  pagesNavBar: MenuItem[] = [];
  user: any;
  isActive: boolean = false;
  activeModule: string | null = null;

  constructor(
    private adminService: AdminService,
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const userId = 18;

    // Function to get pages of user by his id
    this.adminService.getPages(userId).subscribe({
      next: (res: PagesResponse) => {
        this.pages = res.result;
        this.pagesNavBar = this.groupPagesByModule(this.pages);
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
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
    localStorage.removeItem('user');
    this._cookieService.delete('token');
    this._router.navigate(['/home']);
  }

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  toggleSubmenu(module: string) {
    this.activeModule = this.activeModule === module ? null : module;
  }

}
