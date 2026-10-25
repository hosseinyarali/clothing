import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart-item/cart-component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MyOrdersComponent } from './components/my-order/my-orders.component';
import { OrderDetailsComponent } from './components/order-detail/order-detail.component';
import {ProductListComponentComponent} from "./admin/component/productList/product-list-component.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent },

  // دسته‌بندی‌ها
  { path: 'categories', component: CategoryListComponent },

  // محصولات
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  // سبد و تسویه
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  // سفارش‌ها
  { path: 'orders', component: MyOrdersComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },

  // ⬇️ پنل مدیریت (قبل از **)
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent),
      },

      // لیست محصولات
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/component/productList/product-list-component.component')
            .then(m => m.ProductListComponentComponent),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./admin/component/product-form.component')
            .then(m => m.ProductFormComponent),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./admin/component/product-form.component')
            .then(m => m.ProductFormComponent),
      },

      // ⬇️ سفارش‌ها
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/component/order/admin-order-list.component')
            .then(m => m.AdminOrderListComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/component/categoryList/admin-category-list.component')
            .then(m => m.AdminCategoryListComponent),
      },
    ],
  },

  // ⬇️ ** باید آخرین route باشه
  { path: '**', redirectTo: '' },
];
