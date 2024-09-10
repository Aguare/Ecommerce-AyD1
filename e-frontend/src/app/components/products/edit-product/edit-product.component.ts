import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { ProductService } from '../../../services/product.service';
import { Brand } from '../view-products/view-products.component';
import { Category } from '../../card-carrousel/card-carrousel.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  idProducto: number = 0;
  productForm: FormGroup;
  attributeForm: FormGroup;
  sectionVisible: any = { data: true, attributes: false, images: false };
  categories : Category[] = [];
  brands :Brand[] = [];
  images = [{ url: 'path/to/image1.jpg' }, { url: 'path/to/image2.jpg' }];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      category: ['', Validators.required],
    });

    this.attributeForm = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  getBrands() {
    this.productService.getBrands().subscribe({
      next: (res: Brand[]) => {
        this.brands = res;
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }
  
  getCategories() {
    this.productService.getCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res;
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.idProducto = params.idProducto;
    });

    this.getBrands();
    this.getCategories();

    this.productService.getProductById(this.idProducto).subscribe({
      next: (res: any) => {
        
        this.productForm.setValue({
          name: res.productData.name,
          description: res.productData.description,
          price: res.productData.price,
          brand: res.productData.brandId,
          category: res.productData.categoryId,
        })
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Toggle section visibility
  toggleSection(section: string) {
    // Establece la sección seleccionada como visible y oculta las demás
    this.sectionVisible = {
      data: section === 'data',
      attributes: section === 'attributes',
      images: section === 'images',
    };

    console.log(this.sectionVisible);
  }

  // Attribute form array
  get attributes(): FormArray {
    return this.attributeForm.get('attributes') as FormArray;
  }

  addAttribute() {
    const attributeGroup = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.attributes.push(attributeGroup);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  // Handle form submissions
  submitProductForm() {
    if (this.productForm.valid) {
      console.log('Product data:', this.productForm.value);
    }
  }

  submitAttributeForm() {
    if (this.attributeForm.valid) {
      console.log('Attributes:', this.attributeForm.value);
    }
  }

  // Image management
  addImage() {
    this.images.push({ url: 'path/to/newImage.jpg' });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }
}
