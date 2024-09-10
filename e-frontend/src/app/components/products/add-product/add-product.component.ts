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
import { Brand } from '../view-products/view-products.component';
import { ImageService } from '../../../services/image.service';
import { get } from 'http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;

  brandForm: FormGroup;
  isBrandModalActive = false;
  isEditMode = false;
  selectedBrand?: Brand;

  imagePreviews: string[] = [];
  images: File[] = [];

  categories: Category[] = [];
  brands: Brand[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private imageService: ImageService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      attributes: this.fb.array([]),
    });

    this.brandForm = this.fb.group({
      name: ['', Validators.required],
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

    this.getBrands();
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

  onBrandSelect() {
    const selectedBrandId = this.productForm.get('brand')?.value;
    this.selectedBrand =
      this.brands.find((brand) => brand.id == selectedBrandId);

      
  }

  openBrandModal() {
    this.isEditMode = false; 
    this.isBrandModalActive = true;
    this.productForm.get('brand')?.setValue('');
  }

  openEditBrandModal() {
    if (this.selectedBrand) {
      this.isEditMode = true; 
      this.brandForm.patchValue({ name: this.selectedBrand.name });
      this.isBrandModalActive = true;
    }
  }

  closeBrandModal() {
    this.isBrandModalActive = false;
    this.brandForm.reset();
    this.selectedBrand = undefined;
    this.productForm.get('brand')?.setValue('');
  }

  submitBrandForm() {
    if (this.brandForm.valid) {
      const brandData = this.brandForm.value;

      if (this.isEditMode && this.selectedBrand) {
        // update brand

        const body = this.selectedBrand;
        body.name = brandData.name;

        this.productService.updateBrand(this.selectedBrand).subscribe({
          next: (res: any) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.getBrands();
             
          },
          error: (error) => console.error(error),
        });

      } else {
        // add new brand
        this.productService.saveBrand(brandData).subscribe({
          next: (res: any) => {
            Swal.fire('Guardado!', res.message, 'success');
            this.getBrands();
          },
          error: (error) => console.error(error),
        });
      }

      this.closeBrandModal();
    }
  }

  deleteBrand() {
    if (this.selectedBrand) {
      this.productService.deleteBrand(this.selectedBrand.id).subscribe({
        next: (res:any)=> {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.getBrands();
          this.closeBrandModal();
        },
        error: (err)=> {console.log(err);
        }
      })
      
    }
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

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.images.splice(index, 1);
  }

  submitForm() {

    if (this.productForm.valid && this.images.length > 0) {
      const body = this.productForm.value;

      console.log(body);

      this.productService.saveProduct(body).subscribe({
        next: (res: any) => {

          this.images.forEach(img => {
            const formData = new FormData();
            formData.append('image', img);
            formData.append('productId', res.productId);
            this.imageService.saveProductImage(formData).subscribe({
              next: (res: any) => {
                console.log(res);
              },
              error: (error) => {
                console.log(error);
              },
            });
          })

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto Agregado con Exito',
            showConfirmButton: false,
            timer: 1500,
          });

          this.productForm.reset()
          this.imagePreviews = [];
          this.images = [];

        },
        error: (error) => {
          console.log(error);
        },
      });

      
    } else {
      Swal.fire('Guardado!', 'Faltan campos por agregar', 'warning');
    }
  }
}
