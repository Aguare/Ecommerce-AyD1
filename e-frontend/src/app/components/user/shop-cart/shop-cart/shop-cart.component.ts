import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from "../../../commons/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { CartItem } from '../../../../interfaces/index';
import { Product, CartResponse, ImageProduct } from '../../../../interfaces/index';
import { ImageService } from '../../../../services/image.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule, NavbarComponent],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss'
})
export class ShopCartComponent {

  
  public myCart: CartItem[] = [];
  public products: Product[] = [];
  public imageProducts: ImageProduct[] = [];
  public currency: string = '';
  public isLoading: boolean = true;

  

  ngOnInit(): void {
    this.getMyCart();
  }
    
  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private _router: Router
  ) {

  }

  getMyCart(): void {
      this.productService.getMyCart().subscribe((data: CartResponse) => {
        console.log("data", data);
        if (data && data.data) {
          this.myCart = data.data.cart;
          this.products = data.data.info;
          this.imageProducts = data.data.images;
        }else{
          this.myCart = [];
          this.products = [];
          this.imageProducts = [];
          this.isLoading = false;
        }
        this.getCurrency();
      })
  }

  increaseQuantity(index: number): void {
    this.myCart[index].quantity++;
    this.updateCartForQuantity(this.myCart[index]);
  }


  decreaseQuantity(index: number): void {
    if (this.myCart[index].quantity > 1) {
      this.myCart[index].quantity--;
      this.updateCartForQuantity(this.myCart[index]);
    }

  }


  removeProduct(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.productService.removeProduct(this.myCart[index].FK_Product).subscribe();
        //this.myCart.splice(index, 1);
        Swal.fire(
          '¡Eliminado!',
          'Tu producto ha sido eliminado.',
          'success'
        )
      }
    })
   
  }


  getSubtotal(quantity: number, id: number): number {
    const pricePerUnit = this.getPriceProduct(id) ?? 0;
    return quantity * pricePerUnit;
  }
  
  getTotal(): number {
    return this.myCart?.reduce((total, item) => {
      const subtotal = this.getSubtotal(item.quantity, item.FK_Product);
      return total + subtotal;
    }, 0) || 0; 
  }  

  getNameProduct(id: number): string | null {
    const flatProducts = this.products.flat();
    const product = flatProducts.find(product => product.id === id);
    if (!product) {
      console.warn(`Producto con id ${id} no encontrado`);
    }
    return product ? product.name : null;
  }
  
  getPriceProduct(id: number): number | null {
    const flatProducts = this.products.flat();
    const product = flatProducts.find(product => product.id === id);
    if (!product) {
      console.warn(`Producto con id ${id} no encontrado`);
    }
    return product ? product.price : null;
  }  
  
  getImageProduct(id: number): string | null {
    const flatImages = this.imageProducts.flat();
    const image = flatImages.find(image => image.FK_Product === id);
    if (!image) {
      console.warn(`Imagen con id ${id} no encontrada`);
      return null;
    }
    return `${this.imageService.getPort()}${image.image_path}`;
  }

  getCurrency() {
    this.productService.getCurrency().subscribe((data) => {
      if(data) {
        this.currency = data.data.currency;
      }
      this.isLoading = false;
    });
  }

  updateCartForQuantityAll(): void {
    this.myCart.forEach((item) => {
      this.productService.updateCart(item.FK_Product, item.quantity).subscribe();
    });
  }
  updateCartForQuantity(product:CartItem): void {
    this.productService.updateCart(product.FK_Product, product.quantity).subscribe();
  }
  
  addOtherProduct(): void {
    Swal.fire({
      title: '¿Quieres seguir comprando?',
      showDenyButton: true,
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['/products/init']);
      }
    })
  }

  deleteCart(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteCart().subscribe();
        this.myCart = [];
        Swal.fire(
          '¡Eliminado!',
          'Tu carrito ha sido eliminado.',
          'success'
        )
      }
    })
  }

}
