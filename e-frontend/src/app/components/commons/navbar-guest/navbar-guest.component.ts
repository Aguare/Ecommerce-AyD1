/** @format */

import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Output, TemplateRef } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { LocalStorageService } from "../../../services/local-storage.service";
import { CookieService } from "ngx-cookie-service";
import { MatIconModule } from "@angular/material/icon";
import { RegisterModalComponent } from "../register-modal/register-modal.component";
import { ProductService } from "../../../services/product.service";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from "@angular/material/dialog";

@Component({
	selector: "app-navbar-guest",
	standalone: true,
	imports: [CommonModule, RouterLink, MatIconModule, RegisterModalComponent],
	templateUrl: "./navbar-guest.component.html",
	styleUrl: "./navbar-guest.component.scss",
})
export class NavbarGuestComponent {
	showButtonsRegister = true;
	navbarActive: boolean = false;
	branchName: string = "";
	currentBranchId: number = 0;
	readonly dialog = inject(MatDialog);
	branches: any[] = [];
	dialogRef: MatDialogRef<any> | null = null;
	@Output() update = new EventEmitter<any>();

	constructor(
		private _router: Router,
		private _localStorage: LocalStorageService,
		private _cookieService: CookieService,
		private productService: ProductService
	) {}

	ngOnInit() {
		this.productService.getBranchesWithProduct().subscribe((res: any) => {
			this.branches = res;
			this._localStorage.setBranchId(res[0].id);
			this._localStorage.setBranchName(res[0].name);
			this._localStorage.setBranchAddress(res[0].address);
			this.currentBranchId = this._localStorage.getBranchId();
			this.branchName = this._localStorage.getBranchName();
		});

		const userId = this._localStorage.getUserId();
		const url = this._router.url;
		this.showButtonsRegister = !userId && url !== "/login";
		const token = this._cookieService.get("token");
		if (userId && token) {
			this._router.navigate(["/products/init"]);
		}
	}

	toggleNavbar() {
		this.navbarActive = !this.navbarActive;
	}

	openModal(template: TemplateRef<any>) {
		this.productService.getBranchesWithProduct().subscribe((res: any) => {
			this.branches = res;
			this.dialogRef = this.dialog.open(template, { data: this.branches });
		});
	}

	changeBranchId(branch: any) {
		this._localStorage.setBranchId(branch.id);
		this._localStorage.setBranchName(branch.name);
		this._localStorage.setBranchAddress(branch.address);
		this.branchName = branch.name;
		this.currentBranchId = branch.id;
		if (this.dialogRef) {
			this.dialogRef.close();
		}

		window.location.reload();
	}
}
