/** @format */

import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, OnInit, Output, TemplateRef } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { AdminService, Page, PagesResponse } from "../../../services/admin.service";
import { CookieService } from "ngx-cookie-service";
import { ImagePipe } from "../../../pipes/image.pipe";
import { LocalStorageService } from "../../../services/local-storage.service";
import Swal from "sweetalert2";
import { ProductService } from "../../../services/product.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatBadgeModule } from "@angular/material/badge";

interface MenuItem {
	module: string;
	pages: PageItem[];
}

interface PageItem {
	pageName: string;
	direction: string;
	isAvailable: number;
}

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [CommonModule, MatIconModule, RouterLink, ImagePipe, MatTooltipModule, MatBadgeModule],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.scss",
	providers: [CookieService],
})
export class NavbarComponent implements OnInit {
	isClient = true;
	pages: Page[] = [];
	pagesNavBar: MenuItem[] = [];
	userName: any;
	userId: any;
	userImage: string = "";
	isActive: boolean = false;
	activeModule: string | null = null;
	logo: string = "";
	branchName: string = "";
	branchAddress: string = "";
	currentBranchId: number = 0;
	readonly dialog = inject(MatDialog);
	branches: any[] = [];
	dialogRef: MatDialogRef<any> | null = null;
	numberInCart: number = 0;

	constructor(
		private adminService: AdminService,
		private _router: Router,
		private _cookieService: CookieService,
		private _localStorage: LocalStorageService,
		private productService: ProductService
	) {}

	ngOnInit(): void {
		this.userId = this._localStorage.getUserId();
		this.userName = this._localStorage.getUserName();
		this.logo = this._localStorage.getCompanyLogo();

		const branchId = this._localStorage.getBranchId();

		if (!branchId) {
			this.productService.getBranchesWithProduct().subscribe({
				next: (res: any) => {
					this.branches = res;
					this.branchName = res[0].name;
					this.branchAddress = res[0].address;
					this._localStorage.setBranchId(res[0].id);
					this._localStorage.setBranchName(res[0].name);
					this._localStorage.setBranchAddress(res[0].address);
					this.currentBranchId = res[0].id;
				},
				error: (err: any) => {
					Swal.fire({ icon: "error", title: "Error", text: "Error al obtener la sucursal" });
				},
			});
		} else {
			this.branchName = this._localStorage.getBranchName();
			this.branchAddress = this._localStorage.getBranchAddress();
			this.currentBranchId = branchId;
		}

		// Function to get pages of user by his id
		this.adminService.getPages(this.userId).subscribe({
			next: (res: PagesResponse) => {
				this.pages = res.result;
				this.pagesNavBar = this.groupPagesByModule(this.pages);
			},
			error: (err: any) => {

			},
		});

		this.productService.updateViews.subscribe(() => {
			this.currentBranchId = this._localStorage.getBranchId();
			this.branchName = this._localStorage.getBranchName();
			this.branchAddress = this._localStorage.getBranchAddress();
		});

		this.productService.getNumberInCart().subscribe({
			next: (res: any) => {
				this.numberInCart = res.number;
			},
			error: (err: any) => {
				Swal.fire({ icon: "error", title: "Error", text: "Error al obtener el carrito" });
			},
		});

		const photo = this._localStorage.getUserPhoto();

		if (!photo) {
			this.adminService.getUserImageProfile(this.userId).subscribe({
				next: (res: any) => {
					this.userImage = res.imageProfile;
					this._localStorage.setUserPhoto(res.imageProfile);
				},
				error: (err: any) => {
					this.userImage = "img/default/profile.jpg";
					this._localStorage.setUserPhoto("img/default/profile.jpg");
				},
			});
			return;
		}

		this.userImage = photo;
	}

	/**
	 * Method to convert pages to navbarMenu
	 * @param pages
	 * @returns
	 */
	groupPagesByModule(pages: Page[]): MenuItem[] {
		const groupedPages: { [key: string]: PageItem[] } = {};

		pages.forEach((page) => {
			if (!groupedPages[page.moduleName]) {
				groupedPages[page.moduleName] = [];
			}
			groupedPages[page.moduleName].push({
				pageName: page.pageName,
				direction: page.direction,
				isAvailable: page.isAvailable,
			});
		});

		return Object.keys(groupedPages).map((moduleName) => ({
			module: moduleName,
			pages: groupedPages[moduleName],
		}));
	}

	logout() {
		this._localStorage.clear();
		this._cookieService.delete("token");
		this._router.navigate(["/home"]);
	}

	toggleNavbar() {
		this.isActive = !this.isActive;
	}

	toggleSubmenu(module: string) {
		this.activeModule = this.activeModule === module ? null : module;
	}

	myAccount() {
		this._router.navigate([`/account/${this.userName}`]);
	}

	shopCart() {
		this._router.navigate([`/shop/cart/${this.userName}`]);
	}

	openModal(template: TemplateRef<any>) {
		this.productService.getBranchesWithProduct().subscribe({
			next: (res: any) => {
				this.branches = res;
				this.dialogRef = this.dialog.open(template, { data: this.branches });
			},
			error: (err: any) => {
				Swal.fire({ icon: "error", title: "Error", text: "Error al obtener la sucursal" });
			},
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
