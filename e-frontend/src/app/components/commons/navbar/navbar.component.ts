import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminService, Page, PagesResponse } from '../../../services/admin.service';
import { error, log } from 'console';

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
  isLoggedIn = false;
  rol: string = '';
  menuItems: MenuItem[] = [];
  isClient = false;
  pages: Page[] = [];
  pagesNavBar: MenuItem[] = []

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    const userId = 1; // El ID del usuario para enviar en la petición
    this.adminService.getPages(1).subscribe({
      next: (res: PagesResponse) => {
        this.pages = res.result;
        this.pagesNavBar = this.groupPagesByModule(this.pages);
        console.log(this.pagesNavBar);
        
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

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
  buildMenu(): void {
    this.menuItems = [...this.getDynamicItems()];
  }

  /** Ejemplo para probar los menuItems */
  getDynamicItems(): any[] {
    const dynamicItems = [];

    if (this.rol === 'Administrador') {
      this.isClient = false;
      dynamicItems.push(
        {
          name: 'Productos',
          link: '---',
          items: [
            { name: 'Agregar Producto', link: '/addProduct' },
            { name: 'Ver Productos', link: '/products' },
          ],
        },
        {
          name: 'Pedidos',
          link: '----',
          items: [{ name: 'Gestionar Pedidos', link: '/orders' }],
        },
        {
          name: 'Reportes',
          link: '----',
          items: [
            { name: 'Dashboard', link: '/dashboard' },
            { name: 'Reportes Perzonalizados', link: '/personal-reports' },
          ],
        },
        {
          name: 'Tienda',
          link: '----',
          items: [
            { name: 'Configuracion', link: '/store-config' },
            { name: 'Facturacion', link: '/store-billing' },
          ],
        },
        {
          name: 'Ayudantes',
          link: '----',
          items: [
            { name: 'Crear Ayudante', link: '/create-assistant' },
            { name: 'Permisos', link: '/assistants' },
          ],
        }
      );
    }

    return dynamicItems;
  }
}
