import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Order, OrderStatus } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { ProductService } from '../../../services/product.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatIconModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderCardComponent implements OnInit{

  @Input() order!: Order;
  @Input() showAdminOptions: boolean = false;
  orderStatus: any = OrderStatus;
 
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  viewOrder() {
    this.productService.sendOrder.emit(this.order);
  }

  updateStatus(status: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres cambiar el estado del pedido a ${this.orderStatus[status]}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.updateOrderStatus(this.order.id, status).subscribe((res) => {
          Swal.fire('Actualizado', 'Se ha actualizado el estado del pedido!.', 'success');
          window.location.reload();

        }, (err) => {
          Swal.fire('Error', 'Ha ocurrido un error al actualizar el estado del pedido!.', 'error');
          console.log(err);
        });
      }
    }); 
  }
}
