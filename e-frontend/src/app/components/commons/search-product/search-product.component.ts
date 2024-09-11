import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ProductService } from '../../../services/product.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [NavbarComponent, ProductCardComponent, CommonModule],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss'
})
export class SearchProductComponent implements OnInit {

  products: any[] = [];
  currency = '$';
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _localStorageService: LocalStorageService,
    private _productService: ProductService
  ) { }

  ngOnInit(): void {
    const currency = this._localStorageService.getCurrency();
    const product = this._activatedRoute.snapshot.paramMap.get('product');

    if(!product) {
      Swal.fire({
        title: 'Ups!',
        text: 'No se ha encontrado el producto',
        icon: 'question'
      });
      this._router.navigate(['/products/init']);
    }

    const branchId = this._localStorageService.getBranchId();

    if(!branchId) {
      Swal.fire({
        title: 'Ups!',
        text: 'No se ha encontrado la sucursal',
        icon: 'question'
      });
      this._router.navigate(['/products/init']);
    }

    this._productService.getProductsLike(product, branchId).subscribe((data: any) => {
      console.log(data)
      this.products = data;
    }, (error) => {
      Swal.fire({
        title: 'Ups!',
        text: 'No se ha encontrado el producto',
        icon: 'question'
      });
      this._router.navigate(['/products/init']);
    });
    
  }

}
