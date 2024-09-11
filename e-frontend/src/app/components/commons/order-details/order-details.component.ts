import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Order, OrderProduct, OrderStatus } from '../../../interfaces';
import { ProductService } from '../../../services/product.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RegisterModalComponent, DatePipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetailsComponent implements OnInit {

  @Input() order!: Order;
  isActive = true;
  readonly limit: number = 5;
  currentPage = 0;
  currency = '$';
  orderProducts: OrderProduct[] = [];
  orderStatus: any = OrderStatus;
  columns: string[] = ['No.', 'Nombre', 'Cantidad', 'Precio', 'Impuestos', 'Total', 'Sucursal'];


  constructor(private productService: ProductService, private _localStorageService: LocalStorageService) { }
  ngOnInit(): void {
    this.currency = this._localStorageService.getCurrency() ? this._localStorageService.getCurrency() : '$';
    this.productService.getProductsByOrderId(this.order.id, this.limit, this.limit * this.currentPage).subscribe((data) => {
      this.orderProducts = data;
    });
  }

  close() {
    this.productService.sendOrder.emit(null);
    this.isActive = false;
  }
}
