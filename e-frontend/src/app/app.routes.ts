import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PruebaMaterialComponent } from './prueba-material/prueba-material.component';
import { HomeComponent } from './components/commons/home/home.component';
import { LoginComponent } from './components/commons/login/login.component';
import { StoreConfigComponent } from './components/admin/store-config/store-config.component';
import { NotFoundComponent } from './components/commons/not-found/not-found.component';
import { ProductHomeComponent } from './components/products/product-home/product-home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: PruebaMaterialComponent },
  { path: 'store-config', component: StoreConfigComponent },
  { path: 'store-billing', component: StoreConfigComponent },
  {
    path: 'products', children: [
      { path: 'init', component: ProductHomeComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
