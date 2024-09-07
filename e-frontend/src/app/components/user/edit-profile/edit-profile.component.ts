/** @format */

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminService } from "../../../services/admin.service";
import { ImageService } from "../../../services/image.service";
import Swal from "sweetalert2";
import { NavbarComponent } from "../../commons/navbar/navbar.component";
import { LocalStorageService } from "../../../services/local-storage.service";

@Component({
	selector: "app-edit-profile",
	standalone: true,
	imports: [ReactiveFormsModule, NavbarComponent],
	templateUrl: "./edit-profile.component.html",
	styleUrl: "./edit-profile.component.scss",
})
export class EditProfileComponent implements OnInit {
	editProfileForm!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private adminService: AdminService,
		private imageService: ImageService,
		private localStorageService: LocalStorageService
	) {
		this.editProfileForm = this.formBuilder.group({
			nit: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
			description: [""],
			isPreferCash: [1],
			image: [" ", Validators.required],
		});
	}
	ngOnInit(): void {
		const username = this.localStorageService.getUserName();

		if (!username) {
			this.router.navigate(["/"]);
			return;
		}
		this.adminService.getUserInformation(username).subscribe({
			next: (res: any) => {
				this.editProfileForm.get("nit")?.setValue(res.user.nit);
				this.editProfileForm.get("description")?.setValue(res.user.description);
				this.editProfileForm.get("isPreferCash")?.setValue(res.user.isPreferCash);
				this.editProfileForm.get("image")?.setValue(res.user.imageProfile);
			},
			error: (err: any) => {
				console.log("Error:", err);
			},
		});
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.editProfileForm.get("image")?.setValue(file);
		}
	}

	goBack() {
		const username = this.localStorageService.getUserName();
		this.router.navigate([`account/${username}`]);
	}

	updateProfile() {
		if (this.editProfileForm.invalid) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Por favor, llena todos los campos correctamente",
			});
			return;
		}
		const id = this.localStorageService.getUserId();

		if (!id) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "No se ha podido identificar al usuario",
			});
			return;
		}

		const formData = new FormData();
		formData.append("image", this.editProfileForm.get("image")?.value);

		this.imageService.saveClientImage(formData).subscribe(
			(response) => {
				const { nit, description, isPreferCash } = this.editProfileForm.value;
				const image = response.data;
				this.localStorageService.setUserPhoto(image);
				this.adminService.updateUserInformation({ nit, description, isPreferCash, image }, id).subscribe(
					(res) => {
						Swal.fire({
							icon: "success",
							title: "Éxito",
							text: "Información actualizada correctamente",
						});
					},
					(err) => {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Ocurrió un error al actualizar la información",
						});
					}
				);
			},
			(err) => {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Ocurrió un error al subir la imagen",
				});
			}
		);
	}
}
