import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { Order, OrderStatus } from '../../../interfaces';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { OrderDetailsComponent } from '../../commons/order-details/order-details.component';
import { OrderCardComponent } from '../../commons/order-card/order-card.component';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [NavbarComponent, OrderDetailsComponent, OrderCardComponent, ReactiveFormsModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {

  orders : Order[] = [];
  currentOrders: Order[] = [];
  orderSelected: Order | null = null;
  branches: any[] = [];
  branchIdControl = new FormControl(0);
  orderStatus: any[] = [];
  enumOrderStatus: any = OrderStatus;
  statusControl = new FormControl('all');
  constructor(private _productService: ProductService) { }

  ngOnInit(): void {
    this._productService.getOrdersByUserId().subscribe((data) => {
      this.orders = data;
      this.currentOrders = this.orders;
    });

    this._productService.sendOrder.subscribe((order) => {
      this.orderSelected = order;
    });

    this._productService.getStores().subscribe((res) => {
      console.log(res.data)
      this.branches = res.data.stores;

    });

    this._productService.getOrderStatus().subscribe((res) => {
      this.orderStatus = res;
    });
  }

  filter(){
    const branchId = this.branchIdControl.value;
    const status = this.statusControl.value;
    if(branchId == 0){
      this.currentOrders = this.orders;
    }else{
      this.currentOrders = this.orders.filter((order) => order.branch_id == branchId );
    }

    if (status === 'all') return;
      this.currentOrders = this.currentOrders.filter((order) => order.status === status);
  }
}
