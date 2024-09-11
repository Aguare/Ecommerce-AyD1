import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from "../../../commons/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { ImageService } from '../../../../services/image.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CartItem, Product, CartResponse, ImageProduct } from '../../../../interfaces/index';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule, 
    NavbarComponent, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss'
})
export class ShopCartComponent implements OnInit {
  
  public myCart: CartItem[] = [];
  public products: Product[] = [];
  public imageProducts: ImageProduct[] = [];
  public currency: string = '';
  public isLoading: boolean = true;
  public deliveryOptions: string[] = ['online', 'store'];

  public deliveryOption: string = 'store';
  public stores: any[] = []; 
  public selectedStore: string | null = ''; 
  public productStock: { [productId: number]: number } = {};
  public productOutOfStock: { [productId: number]: boolean } = {}; 
  public isUserChangingStore: boolean = false;
  public isModalActive: boolean = false;

  public nitBill: string = '';  
  public nameBill: string = ''; 
  public addressBill: string = ''; 
  public referenceAddress: string = ''; 
  public isDelivery: boolean = false;
  public deliveryCost: number = 0; 
  public total: number = 0;

  public deliveryCostCompany: number = 0;

  public branchName: string = ''; 
  public branchAddress: string = '';

  public userData: any = {};

  
  
  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private _router: Router,
    private _localStorageService: LocalStorageService
    
  ) {
    const branchName = this._localStorageService.getItem('branch_name');
    const branchAddress = this._localStorageService.getItem('branch_address');
    const currency = this._localStorageService.getItem('currency');

    this.branchName = branchName ? branchName.replace(/['"]+/g, '') : '';
    this.branchAddress = branchAddress ? branchAddress.replace(/['"]+/g, '') : '';
    this.currency = currency ? currency.replace(/['"]+/g, '') : '';
    
    if (branchName) {
      this.branchName = branchName;
    }
    
    if (branchAddress) {
      this.branchAddress = branchAddress;
    }

    if (currency) {
      this.currency = currency;
    }
  }

  ngOnInit(): void {
    this.getMyCart();
    this.getBranchSelected();
  }

  getMyCart(): void {
    this.productService.getMyCart().subscribe((data: CartResponse) => {
      if (data && data.data) {
        this.myCart = data.data.cart;
        this.products = data.data.info;
        this.imageProducts = data.data.images;
      }
      this.loadStores();
      this.getCurrency();
    },
    (error) => {
      this.isLoading = false;
    });
  }

  getBranchSelected(): void {
    if(this._localStorageService.getBranchId() !== null){
      this.selectedStore = this._localStorageService.getBranchId().toString();
      this.changeStore(this._localStorageService.getBranchId().toString());
    }else{
      this.selectedStore = "2";
      this.changeStore(this.selectedStore.toString());
    }
  }


  setDeliveryOption(option: string): void {
    this.deliveryOption = option;
    if (option === 'online') {
      this.selectedStore = null;
      this.validateStockOnline();
    }else{
      this.selectedStore = this.stores[0].id;
      if(this.selectedStore !== null){
        this.changeStore(this.selectedStore);
      }
      Swal.fire('¡Listo!', 'Escoge un store para ver la existencia de tus productos', 'success');
    }
    
  }

  increaseQuantity(index: number): void {
    this.myCart[index].quantity++;
    this.updateCartForQuantity(this.myCart[index]);
    if(this.deliveryOption === 'online'){
      this.validateStockOnline();
    }else{
      if (this.selectedStore !== null) {
        this.changeStore(this.selectedStore);
      }
    }
  }

  decreaseQuantity(index: number): void {
    if (this.myCart[index].quantity > 1) {
      this.myCart[index].quantity--;
      this.updateCartForQuantity(this.myCart[index]);
    }
    if(this.deliveryOption === 'online'){
      this.validateStockOnline();
    }else{
      if (this.selectedStore !== null) {
        this.changeStore(this.selectedStore);
      }
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
        this.productService.deleteProductCart(this.myCart[index].FK_Product).subscribe();
        this.myCart.splice(index, 1);
        Swal.fire('¡Eliminado!', 'Tu producto ha sido eliminado.', 'success');
      }
    });
  }

  getSubtotal(quantity: number, id: number): number {
    const pricePerUnit = this.getPriceProduct(id) ?? 0;
    return quantity * pricePerUnit;
  }

  getTotal(): number {
    return this.myCart?.reduce((total, item) => {
      if(this.deliveryOption === 'store' && this.productOutOfStock[item.FK_Product]) {
        return total;
      }
      const pricePerUnit = this.getPriceProduct(item.FK_Product) ?? 0;
      total += item.quantity * pricePerUnit;
    
      return total;
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

  loadStores(): void {
    this.productService.getStores().subscribe((data) => {
      if (data) {
        this.stores = data.data.stores;
      }else{
        this.stores = [];
      }
      this.validateStockOnline();
    });
  }

  getCurrency() {
    this.productService.getCurrency().subscribe((data) => {
      if(data) {
        this.currency = data.data.currency;
      }
      this.isLoading = false;
    });
  }

  updateCartForQuantity(product: CartItem): void {
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
    });
  }

  deleteCart(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Se eliminara tu carrito, No podrás revertir esto!",
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
        Swal.fire('¡Eliminado!', 'Tu carrito ha sido eliminado.', 'success');
      }
    });
  }
  
  changeStoreUser(selectedStoreId: string): void {
      this.isUserChangingStore = true;
      this.changeStore(selectedStoreId);
  }


  changeStore(selectedStoreId: string): void {
    if(!this.isUserChangingStore) return;
    this.isUserChangingStore = false;
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Si cambias de sucursal, se eliminara tu carrito actual y No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedStore = selectedStoreId;

        this.productStock = {};
        this.productOutOfStock = {};

        this.myCart.forEach((product, index) => {
          this.productService.validateStock(product.FK_Product, parseInt(selectedStoreId)).subscribe((data: any) => {
            if (data && data.data !== undefined && data.data.length > 0) {
              const stockInfo = data.data[0]; 
        
              if (stockInfo.stock === null || stockInfo.stock === '0') {
                this.productStock[product.FK_Product] = 0; 
                this.productOutOfStock[product.FK_Product] = true;
                this.myCart[index].quantity = 0;
                this.updateCartForQuantity(this.myCart[index]);
              } else {
                this.productStock[product.FK_Product] = parseFloat(stockInfo.stock); 
                
                if (product.quantity > this.productStock[product.FK_Product]) {
                  this.productOutOfStock[product.FK_Product] = true; 
                  this.myCart[index].quantity = this.productStock[product.FK_Product];
                  this.updateCartForQuantity(this.myCart[index]);
                } else {
                  this.productOutOfStock[product.FK_Product] = false; 
                }
              }
        
            } else {
              this.productOutOfStock[product.FK_Product] = true; 
              this.myCart[index].quantity = 0;
              this.updateCartForQuantity(this.myCart[index]);
            }
          });
        });    
      }
    });
  }

  validateStockOnline(): void {
    this.productStock = {};
    this.productOutOfStock = {};

    this.myCart.forEach((product, index) => {
      this.productService.validateStockOnline(product.FK_Product).subscribe((data: any) => {
        if (data && data.data !== undefined && data.data.length > 0) {
          const stockInfo = data.data[0]; 
    
          if (stockInfo.stock === null || stockInfo.stock === '0') {
            this.productStock[product.FK_Product] = 0; 
            this.productOutOfStock[product.FK_Product] = true;
            this.myCart[index].quantity = 0;
            this.updateCartForQuantity(this.myCart[index]);
          } else {
            this.productStock[product.FK_Product] = parseFloat(stockInfo.stock); 

            if (product.quantity > this.productStock[product.FK_Product]) {
              this.productOutOfStock[product.FK_Product] = true; 
              this.myCart[index].quantity = this.productStock[product.FK_Product];
              this.updateCartForQuantity(this.myCart[index]);
            } else {
              this.productOutOfStock[product.FK_Product] = false; 
            }
          }
  
        } else {
          this.productOutOfStock[product.FK_Product] = true; 
          this.myCart[index].quantity = 0;
          this.updateCartForQuantity(this.myCart[index]);
        }
      });
    });
  }
  
  openModal() {
    this.isModalActive = true;
  }

  closeModal() {
    this.isModalActive = false;
  }
  updateDeliveryOption(option: string) {
    if (option === 'delivery') {
      this.deliveryCost = this.deliveryCostCompany; 
      this.total = this.total+this.deliveryCostCompany;
    } else {
      this.deliveryCost = 0;
      this.total = this.total-this.deliveryCostCompany;
    }
  }

  submitCheckout() {    
    if(this.deliveryOption === 'store'){
      if(this.nitBill === '' || this.nameBill === '' || this.addressBill === ''){
        Swal.fire('¡Error!', 'Por favor, llena todos los campos', 'error');
        return;
      }
    }else{
      if(this.nitBill === '' || this.nameBill === '', this.addressBill === '' || this.referenceAddress === ''){
        Swal.fire('¡Error!', 'Por favor, llena todos los campos', 'error');
        return;
      }else{
        this.isDelivery = true;
      }
    }
    // Aquí iría la logica para confirmar compra si esta seguro o no
    Swal.fire({
      title: '¿Estás seguro de realizar la compra?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, comprar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmedPurchase();
        //this.productService.deleteCart().subscribe();
        //this.myCart = [];
      }
    })
  }

  endPurchase(): void {
    this.userData = this.productService.getDataForCheckout().subscribe((data) => {
      if(data && data.data) {
        this.userData = data.data.user;
        if(data.data.info.nit !== null){
        this.nitBill = data.data.info.nit;
        }
      } 
    });
    this.productService.getDeliveryCost().subscribe((data) => {
      if(data) {
        this.deliveryCostCompany = parseInt(data.data.delivery_cost);
      }
    });
    
    this.isModalActive = true;
    this.deliveryCost = 0;
    this.isDelivery = false;
    this.deliveryOption = 'store';
    this.total = this.getTotal();
  }

  confirmedPurchase(): void {
    const checkoutData = {
      nit_bill: this.nitBill,
      name_bill: this.nameBill,
      address_bill: this.addressBill,
      reference_address: this.referenceAddress,
      isDelivery: this.isDelivery,
      delivery_cost: this.isDelivery ? this.deliveryCost : 0,
      status : 'PENDING',
      total_taxes: 0,
      total: this.getTotal(),
      quantity_products : this.myCart.length,
      id_user: this.userData.id,
      id_employee: null,
      id_branch: this._localStorageService.getBranchId(),
    };
    
    this.productService.saveOrder(checkoutData).subscribe((data) => {
      if(data && data.data) {
        Swal.fire('¡Compra realizada!', 'Tu compra ha sido realizada con éxito', 'success');
        this.myCart = [];
        this.isModalActive = false;
        this._router.navigate(['/products/init']);
      }
    }, (error) => {
      Swal.fire('¡Error!', 'Ha ocurrido un error al realizar la compra, revisa los datos', 'error');
    });
  }
  
  
}
