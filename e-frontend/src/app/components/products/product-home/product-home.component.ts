import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from '../../category-carrousell/category-carrousell.component';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ImageCarrousellComponent } from "../../image-carrousell/image-carrousell.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { SimpleCarouselComponent } from '../../simple-carousel/simple-carousel.component';
import { ProductService } from '../../../services/product.service';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule,
    ImageCarrousellComponent,
    NavbarComponent,
    CardCarrouselComponent,
    CategoryCarrousellComponent,
    MatProgressSpinnerModule,
    ImageCarrousellComponent,
    SimpleCarouselComponent
  ],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {

  spinner = true;
  currentBranchId: number = 0;

  homeImages: string[] = [
    'img/carrousell/carrousell-1.jpg',
    'img/carrousell/carrousell-2.jpg',
    'img/carrousell/carrousell-3.jpg',
    'img/carrousell/carrousell-4.jpg',
    'img/carrousell/carrousell-5.jpg',
  ]

  constructor(
    private _productService: ProductService,
    private _localStorageService: LocalStorageService,
    private _adminService: AdminService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.currentBranchId = this._localStorageService.getBranchId();
    setTimeout(() => {
      this.spinner = false;
    }, 700)
    this.verify2FAUser();
  }

  verify2FAUser() {
    const url = this._router.url;

    if (url === "/verify-2FA") {
      return
    }

    const id = this._localStorageService.getUserId();

    this._adminService.verify2FACode({ id }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this._router.navigate(["/verify-2FA"]);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}
