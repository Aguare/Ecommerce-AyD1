import { Verify2faComponent } from './components/commons/verify2fa/verify2fa.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PruebaMaterialComponent } from './prueba-material/prueba-material.component';
import { HomeComponent } from './components/commons/home/home.component';
import { LoginComponent } from './components/commons/login/login.component';
import { StoreConfigComponent } from './components/admin/store-config/store-config.component';
import { NotFoundComponent } from './components/commons/not-found/not-found.component';
import { ProductHomeComponent } from './components/products/product-home/product-home.component';
import { MyAccountComponent } from './components/user/my-account/my-account.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { StoreBillingComponent } from './components/admin/store-billing/store-billing.component';
import { SettingsFormComponent } from './components/admin/company-settings/settings-form/settings-form.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ShopCartComponent } from './components/user/shop-cart/shop-cart/shop-cart.component';
import { ViewProductsComponent } from './components/products/view-products/view-products.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { ProductDetailsComponent } from './components/commons/product-details/product-details.component';
import { VerifyEmailComponent } from './components/commons/verify-email/verify-email.component';
import { AddHelperComponent } from './components/admin/add-helper/add-helper.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { PurchasesComponent } from './components/user/purchases/purchases.component';
import { SearchProductComponent } from './components/commons/search-product/search-product.component';
import { ResetPasswordComponent } from './components/commons/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/commons/forgot-password/forgot-password.component';
import { PermissionsComponent } from './components/admin/permissions/permissions.component';
import { ListReportsComponent } from './components/reports/list-reports/list-reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: PruebaMaterialComponent },
  { path: 'store-config', component: StoreConfigComponent },
  { path: 'store-billing', component: StoreBillingComponent },
  { path: 'company-settings/:name', component: SettingsFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'purchases', component: PurchasesComponent },
  { path: 'account/:username', component: MyAccountComponent },
  { path: 'shop/cart/:username', component: ShopCartComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email/:token/:email', component: VerifyEmailComponent },
  { path: 'search/:product', component: SearchProductComponent },
  { path: 'reset-password/:token/:email', component: ResetPasswordComponent },
  { path: 'add-helper', component: AddHelperComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'verify-2FA', component: Verify2faComponent },
  {
    path: 'edit', children: [
      { path: 'profile', component: EditProfileComponent }
    ]
  },
  {
    path: 'reports', children: [
      { path: 'list', component: ListReportsComponent }
    ]
  },
  {
    path: 'products', children: [
      { path: 'init', component: ProductHomeComponent },
      { path: 'view', component: ViewProductsComponent },
      { path: 'addProduct', component: AddProductComponent },
      { path: 'editProduct', component: EditProductComponent },
    ]
  },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
