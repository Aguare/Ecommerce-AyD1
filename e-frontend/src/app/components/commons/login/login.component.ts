/** @format */

import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RegisterModalComponent } from "../register-modal/register-modal.component";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavbarGuestComponent } from "../navbar-guest/navbar-guest.component";
import Swal from "sweetalert2";
import { AdminService } from "../../../services/admin.service";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ImageService } from "../../../services/image.service";
import { LocalStorageService } from "../../../services/local-storage.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RegisterModalComponent, MatIconModule, MatProgressSpinnerModule, NavbarGuestComponent],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [CookieService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  hide = true;
  isModalVisible = false;
  registerModalTitle = "¡Regístrate!";
  logoUrl = "";
  hidePassword = true;
  isLoading = false;
  isLoginMode = false;

  ngOnInit(): void {
    this.getImgSettings();
  }

  constructor(
    private fb: FormBuilder,
    private _adminService: AdminService,
    private _imageService: ImageService,
    private _router: Router,
    private _cookieService: CookieService,
    private _localStorage: LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value || '';
    const confirmPassword = form.get('confirmPassword')?.value || '';
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  openRegisterModal() {
    this.isModalVisible = true;
    document.body.classList.add("is-modal-active");
  }

  closeRegisterModal() {
    this.isModalVisible = false;
    document.body.classList.remove("is-modal-active");
    this.isLoading = false;
  }

  onRegister() {
    if (this.registerForm.valid) {
      const data = {
        email: this.registerForm.get("email")?.value,
        username: this.registerForm.get("username")?.value,
        password: this.registerForm.get("password")?.value,
      };
      const registerData = this.registerForm.value;
      this.isLoading = true;
      setTimeout(() => {
        this._adminService.register(data).subscribe(
          (response) => {
            Swal.fire("¡Registro exitoso!", "", "success");
            this.closeRegisterModal();
          },
          (error) => {// Muestra detalles del error recibido
            Swal.fire({
              icon: 'error', title: 'Error', text: error.error.message
            })
          }
        );

        this.isLoading = false;
        this.closeRegisterModal();

      }, 1000);
      this.registerForm.reset();
    } else {
      Swal.fire("Error", "Por favor, complete los campos requeridos", "error");
      this.isLoading = false;
      this.registerForm.reset();
      return;
    }
  }

  get usernameOrEmailHasErrorRequired() {
    return this.loginForm.get("usernameOrEmail")?.hasError("required");
  }

  get passwordHasErrorRequired() {
    return this.loginForm.get("password")?.hasError("required");
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword() {
    alert("Olvide mi contraseña");
  }

  onLogin() {
    this.isLoading = true;

    if (this.loginForm.invalid) {
      Swal.fire('Error', 'Por favor, complete los campos requeridos', 'error');
      return;
    }

    const data = {
      username: this.loginForm.get('usernameOrEmail')?.value,
      password: this.loginForm.get('password')?.value
    };

    this._adminService.login(data).subscribe({
      next: (response) => {
        this._cookieService.set('token', response.token);
        this._localStorage.setUserId(response.user.id || "");
        this._localStorage.setUserName(response.user.username || "");
        this._router.navigate(['/products/init']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error', title: 'Error', text: error.error.message
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    }
    )
  }

  getImgSettings() {
    this._imageService.getLogoCompany().subscribe((response) => {
      if (response.data === null || response.data === "") {
        this.logoUrl = this._imageService.getPort() + '/img/default/logo.jpg';
        return;
      }
      this.logoUrl = this._imageService.getPort() + response.data;
    });
  }
}
