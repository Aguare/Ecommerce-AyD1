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
import Swal from 'sweetalert2';
import { ImagePipe } from '../../../pipes/image.pipe';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ImagePipe],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  idProduct: number = 0;
  productForm: FormGroup;
  sectionVisible: any = { data: true, attributes: false, images: false };
  categories: Category[] = [];
  brands: Brand[] = [];
  images: any[] = [];

  attributeForm!: FormGroup;

  imagePreviews: string[] = [];
  imagesToDB: File[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private imageService: ImageService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  createAttributeGroup(attribute?: any): FormGroup {
    return this.fb.group({
      name: [attribute ? attribute.name : '', Validators.required],
      description: [
        attribute ? attribute.description : '',
        Validators.required,
      ],
    });
  }

  get attributesFormArray(): FormArray {
    return this.attributeForm.get('attributes') as FormArray;
  }

  attributeFormGroup(index: number): FormGroup {
    return this.attributesFormArray.at(index) as FormGroup;
  }

  addAttribute(): void {
    this.attributesFormArray.push(this.createAttributeGroup());
  }

  removeAttribute(index: number): void {
    this.attributesFormArray.removeAt(index);
  }

  submitAttributeForm(): void {
    if (this.attributeForm.valid) {
      const { attributes } = this.attributeForm.value;
      if (attributes.length > 0) {
        const body = {
          attributes,
          id: this.idProduct,
        };

        this.productService.updateAttributesProduct(body).subscribe({
          next: (res: any) => {
            console.log(res);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    } else {
      console.log('El formulario no es válido');
    }
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
      this.idProduct = params.idProduct;
    });

    this.getBrands();
    this.getCategories();

    this.productService.getProductById(this.idProduct).subscribe({
      next: (res: any) => {

        this.attributeForm = this.fb.group({
          attributes: this.fb.array(
            res.productAttributes
              ? res.productAttributes.map((attr: any) =>
                  this.createAttributeGroup(attr)
                )
              : []
          ),
        });

        this.productForm.setValue({
          name: res.productData.name,
          description: res.productData.description,
          price: res.productData.price,
          brand: res.productData.brandId,
          category: res.productData.categoryId,
        });

        this.images = res.images;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imagesToDB.push(file);

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

  // Toggle section visibility
  toggleSection(section: string) {
    this.sectionVisible = {
      data: section === 'data',
      attributes: section === 'attributes',
      images: section === 'images',
    };
  }

  // Handle form submissions
  submitProductForm() {
    if (this.productForm.valid) {
      const body = this.productForm.value;
      body.id = this.idProduct;

      this.productService.updateDataProduct(body).subscribe({
        next: (res: any) => {
          console.log(res);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500,
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tienes que llenar todos los campos',
      });
    }
  }

  removeImage(index: number) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar la imagen?',
      showDenyButton: true,
      confirmButtonText: 'Si',
    }).then((result) => {
      if (result.isConfirmed) {
        const deletedImage = this.images[index];

        this.imageService.deleteImage(deletedImage.id).subscribe({
          next: (res: any) => {
            this.images.splice(index, 1);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    });
  }
}
