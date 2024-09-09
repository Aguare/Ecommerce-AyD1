import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetail, StockProduct } from '../../../interfaces';
import { ImagePipe } from '../../../pipes/image.pipe';
import { ImageCarrousellComponent } from '../../image-carrousell/image-carrousell.component';
import Splide from '@splidejs/splide';
import {MatTooltipModule} from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NavbarGuestComponent, ImagePipe, ImageCarrousellComponent, MatTooltipModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{

  isLogged: boolean = false;
  currentBranchId: number = 0;
  productDetail: ProductDetail = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    page_information: '',
    isAvailable: false,
    created_at: '',
    FK_Branch: 0,
    images:  [''],
    attributes: [{name: '', description: ''}]
  };

  stockProducts: StockProduct[] | null = null;
  currency: string = "$";

  constructor(
    private localStorageService: LocalStorageService, 
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {

    const userId = this.localStorageService.getUserId();
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.router.navigate(['/']);
    }

    this.isLogged = userId ? true : false;

    this.productService.getCurrency().subscribe((currency: any) => {
      this.currency = currency.data.currency
    });

    this.productService.getProductById(productId).subscribe((product: ProductDetail) => {
      this.productDetail = product;
      console.log(product);
    });

    this.productService.getStockProductById(productId).subscribe((stock: StockProduct[]) => {
      this.stockProducts = stock;
      if(stock.length > 0) {
        this.currentBranchId = stock[0].id;
      }
    });

    // creating splide carrousel
    setTimeout(() => {
      if (typeof document !== 'undefined' && this.productDetail.images.length > 1) {
        const splideId = '#product-detail-carrousell';
        const splide = new Splide(splideId, {
          type: 'loop',
          heightRatio: 0.5,
          pagination: false,
          cover: true,   
          
        });
        splide.mount();
      }
    }, 500 );

  }

  addToCart(productDetail: ProductDetail) {
    const userId = this.localStorageService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
    }
    
    this.productService.addProductToCart(userId, this.currentBranchId, productDetail.id, 1).subscribe((response: any) => {
      console.log(response);
      Swal.fire({
        title: 'Producto agregado al carrito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
      this.ngOnInit();
    }, error => {
      Swal.fire({
        title: 'Error al agregar el producto al carrito',
        icon: 'error',
        showConfirmButton: false,
        text: error.error.message,
        timer: 1500
      });
    });
  }

  changeBranchId(branchId: number) {
    this.currentBranchId = branchId;
  }
}
