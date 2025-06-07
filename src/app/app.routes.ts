import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ProductListComponent } from './shared/components/product-list/product-list.component';
import { ProductDetailComponent } from './shared/components/product-detail/product-detail.component';
import { ProductCreateEditComponent } from './shared/components/product-create-edit/product-create-edit.component';
import { CategoryManagementComponent } from './shared/components/category-management/category-management.component';
import { CustomerListComponent } from './shared/components/customer-list/customer-list.component';
import { POSComponent } from './shared/components/pos/pos.component';
import { SalesPOSComponent } from './shared/components/sales-pos/sales-pos.component';
import { SalesDashboardComponent } from './shared/components/sales-dashboard/sales-dashboard.component';

export const routes: Routes = [
  // Home and Authentication
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // Admin Management Routes
  {
    path: 'admin',
    children: [
      // Product Management
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductCreateEditComponent },
      { path: 'products/:id/edit', component: ProductCreateEditComponent },
      { path: 'products/:id', component: ProductDetailComponent },

      // Category Management
      { path: 'categories', component: CategoryManagementComponent },

      // Customer Management
      { path: 'customers', component: CustomerListComponent },

      // Size Management
      {
        path: 'sizes',
        loadComponent: () =>
          import(
            './shared/components/size-management/size-management.component'
          ).then((m) => m.SizeManagementComponent),
      },

      // Color Management
      {
        path: 'colors',
        loadComponent: () =>
          import(
            './shared/components/color-management/color-management.component'
          ).then((m) => m.ColorManagementComponent),
      },

      // Staff Management
      {
        path: 'staff',
        loadComponent: () =>
          import(
            './shared/components/staff-management/staff-management.component'
          ).then((m) => m.StaffManagementComponent),
      },

      // Inventory Management
      {
        path: 'inventory',
        loadComponent: () =>
          import(
            './shared/components/inventory-management/inventory-management.component'
          ).then((m) => m.InventoryManagementComponent),
      },

      // Order Management
      {
        path: 'orders',
        loadComponent: () =>
          import(
            './shared/components/order-management/order-management.component'
          ).then((m) => m.OrderManagementComponent),
      },

      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  // Sales Routes
  {
    path: 'sales',
    children: [
      { path: '', component: SalesPOSComponent },
      { path: 'page/:page', component: SalesPOSComponent },
      { path: 'dashboard', component: SalesDashboardComponent },
      { path: 'pos', component: POSComponent }, // Keep old POS for reference
    ],
  },

  // Legacy routes for backward compatibility
  { path: 'products', redirectTo: 'admin/products', pathMatch: 'full' },
  { path: 'customers', redirectTo: 'admin/customers', pathMatch: 'full' },
  { path: 'pos', redirectTo: 'sales', pathMatch: 'full' },

  // Redirect unknown routes
  { path: '**', redirectTo: '/' },
];
