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

@Component({
	selector: "app-login",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RegisterModalComponent, MatIconModule, MatProgressSpinnerModule, NavbarGuestComponent],
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
  providers: [CookieService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent{
	loginForm: FormGroup;
	registerForm: FormGroup;
	hide = true;
	isModalVisible = false;
	registerModalTitle = "¡Regístrate!";
	logoUrl = "https://marketplace.canva.com/EAFMNm9ybqQ/1/0/1600w/canva-gold-luxury-initial-circle-logo-qRQJCijq_Jw.jpg";
	hidePassword = true;
	isLoading = false;

	constructor(
    private fb: FormBuilder,
    private _adminService: AdminService,
    private _router: Router,
    private _cookieService: CookieService
  ) {
		this.loginForm = this.fb.group({
			usernameOrEmail: ["", Validators.required],
			password: ["", Validators.required],
		});

		this.registerForm = this.fb.group({
			name: ["", [Validators.required, Validators.minLength(3)]],
			email: ["", [Validators.required, Validators.email]],
			address: ["", Validators.required],
			nit : ["", Validators.required],
			password: ["", Validators.required],
		});
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
			const registerData = this.registerForm.value;
			this.isLoading = true;
			setTimeout(() => {
				alert("Register Data: " + JSON.stringify(registerData));
				this.isLoading = false;
				this.closeRegisterModal();
			}, 1000);
			this.registerForm.reset();
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

  onLogin(){
    this.isLoading = true;

    if (this.loginForm.invalid) {
      Swal.fire('Error', 'Por favor, complete los campos requeridos', 'error');
      return;
    }

    const data = {
      username: this.loginForm.get('usernameOrEmail')?.value,
      password: this.loginForm.get('password')?.value
    };

    this._adminService.login(data).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        this._cookieService.set('token', response.token);
        this._router.navigate(['/products/init']);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        Swal.fire('Error', 'Ocurrió un error al iniciar sesión', 'error');
      }
    );
  }
}
