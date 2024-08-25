import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';

interface MenuItem {
  name: string;
  link: string;
  items?: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  rol: string = '';
  menuItems: MenuItem[] = [];
  isClient = false;

  constructor() {}

  ngOnInit(): void {
    this.rol = 'Administrador';
    this.buildMenu();
    this.isLoggedIn = true;
    this.isClient = true;
  }

  buildMenu(): void {
    this.menuItems = [...this.getDynamicItems()];
  }

  /** Ejemplo para probar los menuItems */
  getDynamicItems(): any[] {
    const dynamicItems = [];

    if (this.rol === 'Administrador') {
      dynamicItems.push({
        name: 'Usuarios',
        link: '/usuarios',
        items: [
          { name: 'Artículos', link: '/articulos' },
          { name: 'Artículos 1', link: '/articulos' },
          { name: 'Artículos 2', link: '/articulos' },
        ],
      }, {
        name: 'Pagina2',
        link: '/usuarios',
        items: [
          { name: 'Pagina 1', link: '/articulos' },
          { name: 'Pagina 2', link: '/articulos' },
          { name: 'Pagina 3', link: '/articulos' },
        ],
      });
    }
    if (this.rol === 'Editor') {
      dynamicItems.push({ name: 'Artículos', link: '/articulos' });
    }

    return [];
  }
}
