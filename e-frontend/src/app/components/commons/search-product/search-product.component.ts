import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ProductService } from '../../../services/product.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Attribute } from '../../../interfaces';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [NavbarComponent, NavbarGuestComponent, ProductCardComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss'
})
export class SearchProductComponent implements OnInit {

  products: any[] = [];
  currentProducts: any[] = [];
  attributes: Attribute[] = [];
  categories: any[] = [];
  currency = '$';

  filterForm!: FormGroup;
  isLogged = false;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _localStorageService: LocalStorageService,
    private _productService: ProductService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    const userId = this._localStorageService.getUserId();

    this.isLogged = userId ? true : false;

    this.currency = this._localStorageService.getCurrency();
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
      this.products = data;
      this.currentProducts = data;
      this.getCommonAttributes();
      this.getCommonCategories();
    }, (error) => {
      Swal.fire({
        title: 'Ups!',
        text: 'No se ha encontrado el producto',
        icon: 'question'
      });
      this._router.navigate(['/products/init']);
    });
    
    this.filterForm = this.fb.group({
      attributes: this.fb.array([]),
      categories: this.fb.array([])
    });

  }

  getCommonAttributes() {
    this.attributes = [];
    this.products.forEach(product => {
      product.attributes.forEach((attr: Attribute) => {
        // Check if the attribute is already in the array
        if(!this.attributes.includes(attr)) {
          this.attributes.push(attr);
          this.getFormArray('attributes').push(new FormControl(false));
        }
      });
    });


  }

  // Check categories array in products and get the common categories
  getCommonCategories() {
    this.categories = [];
    this.products.forEach(product => {
      product.categories.forEach((category: any) => {
        if(!this.categories.includes(category.name)) {
          this.categories.push(category.name);
          this.getFormArray('categories').push(new FormControl(false));
        }
      });
    });
  }

  getFormArray(value: string) {
    return value === 'attributes' ? this.filterForm.get('attributes') as FormArray : this.filterForm.get('categories') as FormArray;
  }

  filter() {
    this.filterCategories();
    this.filterAttributes();
  }

  filterCategories() {
    const categories = this.filterForm.value.categories
    .map((checked: boolean, index: number) => checked ? this.categories[index] : null)
    .filter((value: any) => value !== null);

    if(categories.length === 0) {
      this.currentProducts = this.products;
      return;
    }

    this.currentProducts = this.products.filter((product: any) => {
      return product.categories.some((category: any) => categories.includes(category.name));
    });
  }

  filterAttributes() {
    const attributes = this.filterForm.value.attributes
    .map((checked: boolean, index: number) => checked ? this.attributes[index] : null)
    .filter((value: any) => value !== null);

    if(attributes.length === 0) {
      return;
    }

    this.currentProducts = this.currentProducts.filter((product: any) => {
      return product.attributes.some((attr: Attribute) => attributes.includes(attr));
    });
  }

}
