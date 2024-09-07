/** @format */

import { Component, inject, OnInit } from "@angular/core";
import {
	FormArray,
	FormControl,
	FormGroup,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { CompanyService } from "../../../../services/company.service";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "../../../commons/navbar/navbar.component";
import { SettingTabsComponent } from "../setting-tabs/setting-tabs.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ImagePipe } from "../../../../pipes/image.pipe";
import { ImageService } from "../../../../services/image.service";
import Swal from "sweetalert2";

type FormRow = FormGroup<{
	label: FormControl<string>;
	name: FormControl<string>;
	value: FormControl<string | File>;
	isRequired: FormControl<boolean>;
}>;

type Form = FormGroup<{
	rows: FormArray<FormRow>;
}>;

@Component({
	selector: "app-settings-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SettingTabsComponent, ImagePipe],
	templateUrl: "./settings-form.component.html",
	styleUrl: "./settings-form.component.scss",
})
export class SettingsFormComponent implements OnInit {
	fb = inject(NonNullableFormBuilder);
	settingName: string = "";
	previews: string[] = [];

	generalForm: Form = this.fb.group({
		rows: this.fb.array<FormRow>([]),
	});

	constructor(
		private companyService: CompanyService,
		private route: ActivatedRoute,
		private router: Router,
		private imageService: ImageService
	) {}

	ngOnInit(): void {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		this.router.events.subscribe((event) => {
			if (event.constructor.name === "NavigationEnd") {
				this.router.navigated = false;
			}
		});

		this.settingName = this.route.snapshot.paramMap.get("name") || "";
		this.companyService.getSettings(this.settingName).subscribe((response) => {
			response.forEach((element: any) => {
				if (element.key_name.includes("img")) {
					this.previews.push(element.key_value);
				}
				this.generalForm.controls.rows.push(
					this.fillForm(element.label, element.key_name, element.key_value, element.is_required)
				);
			});
		});
	}

	fillForm(label: string, name: string, value: string | File, isRequired: boolean): FormRow {
		return this.fb.group({
			label: this.fb.control(label),
			name: this.fb.control(name),
			value: this.fb.control(value, isRequired ? Validators.required : []),
			isRequired: this.fb.control(isRequired),
		});
	}

	onSubmit() {
		console.log("click");
		if (this.generalForm.invalid) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Por favor, llene todos los campos",
			});
			return;
		}

		// get the form data that name is an img
		const imgData = this.generalForm.controls.rows.value.filter(
			(row: any) => row.name.includes("img") && row.value instanceof File
		);

		// get the form data that name is not an img
		const data = this.generalForm.controls.rows.value.filter((row: any) => !row.name.includes("img"));

		// Send imData to the server
		imgData.forEach((element: any) => {
			console.log(element);
			const formData = new FormData();
			formData.append("image", element.value);
			formData.append("keyName", element.name);
			this.imageService.saveCompanyImage(formData).subscribe(
				(response) => {
					Swal.fire({
						icon: "success",
						title: "Éxito",
						text: "Imagen subida correctamente",
					});
				},
				(error) => {
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Error al subir la imagen",
					});
				}
			);
		});

		this.companyService.updateSettings(data).subscribe({
			next: (data) => {
				Swal.fire({
					icon: "success",
					title: "Éxito",
					text: "Datos actualizados correctamente",
				});
			},
			error: (error) => {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Error al actualizar los datos",
				});
			},
		});
	}

	onFileSelected(event: Event, rowIndex: number) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			// this.editProfileForm.get("image")?.setValue(file);
			this.generalForm.controls.rows.controls[rowIndex].controls.value.setValue(file);
			const previewUrl = URL.createObjectURL(file);
			if (this.previews.length > 1) {
				this.previews[1] = previewUrl;
			} else {
				this.previews.push(previewUrl);
			}
		}
	}

	deleteImage(rowIndex: number) {
		this.previews.pop();
		if (this.previews.length === 1) {
			this.generalForm.controls.rows.controls[rowIndex].controls.value.setValue(this.previews[0]);
		}
	}
}
