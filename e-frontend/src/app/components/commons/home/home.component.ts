import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, TemplateRef } from '@angular/core';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { SimpleCarouselComponent } from '../../simple-carousel/simple-carousel.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { CardCarrouselComponent } from '../../card-carrousel/card-carrousel.component';
import { CategoryCarrousellComponent } from "../../category-carrousell/category-carrousell.component";
import { ImageCarrousellComponent } from "../../image-carrousell/image-carrousell.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { ProductService } from '../../../services/product.service';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ImageCarrousellComponent, 
    SimpleCarouselComponent, 
    NavbarGuestComponent, 
    CardCarrouselComponent, 
    CategoryCarrousellComponent, 
    ImageCarrousellComponent,
    RegisterModalComponent
  
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class HomeComponent implements OnInit {

  homeImages: string[] = [
    'img/carrousell/carrousell-1.jpg',
    'img/carrousell/carrousell-2.jpg',
    'img/carrousell/carrousell-3.jpg',
    'img/carrousell/carrousell-4.jpg',
    'img/carrousell/carrousell-5.jpg',
  ]

  constructor(
    private _localStorage: LocalStorageService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    const branchId = this._localStorage.getBranchId();

    if(!branchId) {
      this.productService.getBranchesWithProduct().subscribe((res: any) => {
        this._localStorage.setBranchId(res[0].id);
        this._localStorage.setBranchName(res[0].name);
        this._localStorage.setBranchAddress(res[0].address);
      });
    }

    this.productService.getCurrency().subscribe((res: any) => {
      this._localStorage.setCurrency(res.data.currency);
    });

  }

  updateComponent() {

  }
}
