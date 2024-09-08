import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarGuestComponent } from '../navbar-guest/navbar-guest.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetail } from '../../../interfaces';
import { ImagePipe } from '../../../pipes/image.pipe';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NavbarGuestComponent, ImagePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{

  isLogged: boolean = false;
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
    images:  [{id: 0, image_path: '', FK_Product: 0, created_at: ''}],
    attributes: [{name: '', description: ''}]
  };

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

    this.productService.getProductById(productId).subscribe((product: ProductDetail) => {
      console.log(product);
      this.productDetail = product;
    });
  }
}
