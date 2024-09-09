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
import { ProductDetailsComponent } from './components/commons/product-details/product-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: PruebaMaterialComponent },
  { path: 'store-config', component: StoreConfigComponent },
  { path: 'store-billing', component: StoreBillingComponent },
  { path: 'company-settings/:name', component: SettingsFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'account/:username', component: MyAccountComponent },
  { path: 'shop/cart/:username', component: ShopCartComponent },
  { 
    path: 'edit', children: [
      { path: 'profile', component: EditProfileComponent }
    ]
  },
  {
    path: 'products', children: [
      { path: 'init', component: ProductHomeComponent }
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
