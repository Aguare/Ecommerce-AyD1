import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface MenuItem {
  name: string;
  link: string;
  items: MenuItem[];
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

  constructor() {}

  ngOnInit(): void {
    this.rol = 'Administrador';
    this.buildMenu();
    this.isLoggedIn = true;
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
