import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminService, Page, PagesResponse } from '../../../services/admin.service';

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
})
export class NavbarComponent implements OnInit {

  isClient = true;
  pages: Page[] = [];
  pagesNavBar: MenuItem[] = []

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    const userId = 2; 

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

}
