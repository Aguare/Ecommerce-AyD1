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
	isLoginMode = false;

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
				alert("Register Data: " + JSON.stringify(registerData));
				this._adminService.register(data).subscribe(
				(response) => {
					Swal.fire("¡Registro exitoso!", "", "success");
					this.closeRegisterModal();
				},
				(error) => {
					console.log('Error recibido:', error);  // Muestra detalles del error recibido
					Swal.fire("Error", "Ocurrió un error al registrar el usuario", "error");
				}
				);

				this.isLoading = false;
				this.closeRegisterModal();

			}, 1000);
			this.registerForm.reset();
		}else{
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
