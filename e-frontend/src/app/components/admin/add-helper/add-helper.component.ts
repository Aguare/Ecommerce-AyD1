import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NavbarComponent } from '../../commons/navbar/navbar.component';
import { ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, MatProgressSpinnerModule, CommonModule, MatIconModule],
  templateUrl: './add-helper.component.html',
  styleUrls: ['./add-helper.component.scss']
})
export class AddHelperComponent implements OnInit {
  public stores: any[] = [];
  
  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Cliente' },
    { id: 3, name: 'Ayudante' }
  ];
  
  form: FormGroup;
  public isLoading = true;
  hidePassword = true;
  hide = true;

  constructor(private _fb: FormBuilder, private _productService: ProductService,
    private _adminService: AdminService
  ) {
    this.form = this._fb.group(
      {
        first_name: ['', [Validators.required, Validators.maxLength(100)]],
        last_name: ['', [Validators.required, Validators.maxLength(100)]],
        DPI: ['', [Validators.required, Validators.maxLength(13)]],
        date_birth: ['', Validators.required],
        tel: ['', [Validators.required, Validators.maxLength(20)]],
        FK_Branch: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.maxLength(50)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', [Validators.required]],
        role: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator } 
    );
  }

  ngOnInit(): void {
    this.loadStores();
  }

  onReset(): void {
    this.form.reset();
    this.form.get('FK_Branch')?.setValue(this.stores[0].id);
    this.form.get('role')?.setValue(this.roles[0].id);
  }

  loadStores(): void {
    this._productService.getStores().subscribe((data) => {
      if (data) {
        this.stores = data.data.stores;
        this._adminService.getRoles().subscribe((data) => {
          if (data.data) {
            this.roles = data.data;
            this.form.get('role')?.setValue(this.roles[0].id);
          }
        });

        this.form.get('FK_Branch')?.setValue(this.stores[0].id);
      } else {
        this.stores = [];
      }
    });
    this.isLoading = false;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      this._adminService.saveEmployeeInformation(this.form.value).subscribe((data) => {
        if(data) {
          console.log('Empleado guardado con éxito');
          Swal.fire('¡Empleado guardado con éxito!', '', 'success');
          this.onReset();
        }
      }, (error) => {
        console.log('Error al guardar empleado', error);
        Swal.fire('¡Error al guardar empleado!', '', 'error');
      });

    } else {
      console.log('Formulario no válido');
    }
  }

}
