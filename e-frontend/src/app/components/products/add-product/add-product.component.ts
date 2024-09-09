import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Splide from '@splidejs/splide';
import { log } from 'console';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../card-carrousel/card-carrousel.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit{
  productForm: FormGroup;
  imagePreviews: string[] = [];
  images: File[] = [];

  categories : Category[] = [];
  brands = ['Samsung', 'Apple', 'Lenovo', 'LG'];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      attributes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res;     
      },
      error: (err: any) => {
        console.log('Error:', err);
      },
    });
  }

  get attributes() {
    return this.productForm.get('attributes') as FormArray;
  }

  addAttribute() {
    const attributeForm = this.fb.group({
      attributeName: ['', Validators.required],
      attributeValue: ['', Validators.required],
    });
    this.attributes.push(attributeForm);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.images.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'La imagen se agrego correctamente',
          showConfirmButton: false,
          timer: 1500,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number){
    this.imagePreviews.splice(index, 1);
    this.images.splice(index,1)
  }

  submitForm() {
    
    if (this.productForm.valid && this.images.length > 0) {
      console.log('Producto enviado:', this.productForm.value);
      
    } else {
      console.log('invalido');
      
    }
  }

}
