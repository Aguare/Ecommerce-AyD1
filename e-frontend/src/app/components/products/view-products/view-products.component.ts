import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../simple-carousel/simple-carousel.component';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../commons/navbar/navbar.component";
import { LocalStorageService } from '../../../services/local-storage.service';

export interface Brand {
  id: number;
  name: string;
}

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss'
})
export class ViewProductsComponent implements OnInit{

  searchQuery: string = '';
  products: Product[] = [];
  currency: string = '';

  constructor(private productService: ProductService, private router:Router, private _localStorageService: LocalStorageService) {
    this.currency = this._localStorageService.getCurrency();
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;       
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }


  get filteredProducts() {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  editProduct(id: number) {
    this.router.navigate(['/products/editProduct'],{
      queryParams: { idProduct: id },
    })
  }

  addProduct(){
    this.router.navigate(['/products/addProduct'])
  }
}
