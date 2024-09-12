/** @format */

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminService } from "../../../services/admin.service";
import { ImageService } from "../../../services/image.service";
import Swal from "sweetalert2";
import { NavbarComponent } from "../../commons/navbar/navbar.component";
import { LocalStorageService } from "../../../services/local-storage.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-profile",
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, CommonModule],
  templateUrl: "./edit-profile.component.html",
  styleUrl: "./edit-profile.component.scss",
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedFileName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private imageService: ImageService,
    private localStorageService: LocalStorageService
  ) {
    this.editProfileForm = this.formBuilder.group({
      nit: [""],
      description: [""],
      isPreferCash: [1],
      image: [""],
      isTwoFactor: [""],
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
        this.editProfileForm.patchValue({
          isTwoFactor: res.user.is2FA,
          nit: res.user.nit,
          description: res.user.description,
          isPreferCash: res.user.isPreferCash,
          image: res.user.imageProfile,
        });
        this.imagePreviewUrl = `http://localhost:3002/${res.user.imageProfile}`;
      },
      error: (err: any) => {
        console.log("Error:", err);
      },
    });
  }

  activate2FA() {
    if (this.editProfileForm.get("isTwoFactor")?.value) {
      Swal.fire({
        title: "¿Desea desactivar la autenticación de dos factores?",
        text: "Esto puede hacer que su cuenta sea menos segura",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.editProfileForm.get("isTwoFactor")?.setValue(false);
        } else {
          this.editProfileForm.get("isTwoFactor")?.setValue(true);
        }
      });
      return;
    }

    Swal.fire({
      title: "¿Desea activar la autenticación de dos factores?",
      text: "Se le enviará un código a su correo cada vez que inicie sesión. Pero será más seguro",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.editProfileForm.get("isTwoFactor")?.setValue(true);
      } else {
        this.editProfileForm.get("isTwoFactor")?.setValue(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editProfileForm.get("image")?.setValue(file);
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.editProfileForm.markAsTouched();
    }
  }

  goBack() {
    const username = this.localStorageService.getUserName();
    this.router.navigate([`account/${username}`]);
  }

  updateProfile() {
    if (this.editProfileForm.untouched) {
      Swal.fire({
        icon: "question",
        title: "Ups!",
        text: "No se han modificado los datos.",
      });
      return;
    }

    const id: any = this.localStorageService.getUserId()

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha encontrado el usuario",
      });
    }

    const formData = new FormData();
    formData.append("image", this.editProfileForm.get("image")?.value);
    formData.append('id', id);

    let image: string = '';
    if (typeof this.editProfileForm.get("image")?.value === 'string') {
      image = this.editProfileForm.get("image")?.value;
    }


    this.imageService.saveClientImage(formData).subscribe(
      (response) => {
        const { nit, description, isPreferCash, isTwoFactor } = this.editProfileForm.value;
        if (image === '') {
          image = response.data;
        }
        this.localStorageService.setUserPhoto(image);
        console.log(image);

        this.adminService.updateUserInformation({ nit, description, isPreferCash, image, isTwoFactor }, id).subscribe(
          () => {
            Swal.fire({
              icon: "success",
              title: "Éxito",
              text: "Información actualizada correctamente",
            }).then(() => {
              location.reload(); // Recarga la página después de guardar los cambios
            });
          },
          (err) => {
            console.log(err);

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

