import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import {ProductListComponent} from './products/product-list/product-list.component';
import {ProductFormComponent} from './products/product-form/product-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'register', redirectTo: 'login/register' },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
