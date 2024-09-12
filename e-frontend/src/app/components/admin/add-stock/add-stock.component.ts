import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { IntegerPipe } from '../../../pipes/integer.pipe';
import { LocalStorageService } from '../../../services/local-storage.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../commons/navbar/navbar.component";

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, IntegerPipe, ReactiveFormsModule, FormsModule, NavbarComponent],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.scss',
})
export class AddStockComponent {
  addStockForm!: FormGroup;

  products: any[] = [];
  stores: any[] = [];
  stockList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.addStockForm = this.fb.group({
      product: ['', Validators.required],
      store: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(1)]],
    });

    this.productService.getProductsAndBranchesForStock().subscribe({
      next: (res: any) => {
        this.stores = res.branches;
        this.products = res.products;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onProductChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProductId = selectElement.value;
    if (selectedProductId) {
      this.productService
        .getStockOfProductByBranch(+selectedProductId)
        .subscribe({
          next: (res: any) => {
            this.stockList = res;
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.stockList = [];
    }
  }

  onSubmit() {
    if (this.addStockForm.valid) {
      const storeId = this.addStockForm.value.store;
      const actualBranch = this.stores.find((br) => br.id == storeId);
      const stockAvailable = this.stockList.find(
        (st) => st.name == actualBranch.name
      );

      const body = this.addStockForm.value;
      body.actualStock = stockAvailable.stock;
      body.idUser = this.localStorageService.getUserId();


      this.productService.addStockInventory(body).subscribe({
        next: (res: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se agregaron los productos en el inventario',
            showConfirmButton: false,
            timer: 1500,
          });

          this.addStockForm.reset();
          this.addStockForm.setValue({
            product: body.product,
            store: '',
            stock: 0,
          });
          stockAvailable.stock = Number(body.actualStock) + body.stock;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
