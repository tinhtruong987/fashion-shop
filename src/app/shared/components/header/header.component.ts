import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    MenubarModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Trang Chủ',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Bán Hàng',
      icon: 'pi pi-shopping-cart',
      items: [
        {
          label: 'POS - Bán hàng',
          icon: 'pi pi-shopping-cart',
          routerLink: '/sales',
        },
        {
          label: 'Báo cáo & Thống kê',
          icon: 'pi pi-chart-bar',
          routerLink: '/sales/dashboard',
        },
      ],
    },
    {
      label: 'Quản Trị',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Sản phẩm',
          icon: 'pi pi-box',
          routerLink: '/admin/products',
        },
        {
          label: 'Danh mục',
          icon: 'pi pi-list',
          routerLink: '/admin/categories',
        },
        {
          label: 'Kích cỡ',
          icon: 'pi pi-tag',
          routerLink: '/admin/sizes',
        },
        {
          label: 'Màu sắc',
          icon: 'pi pi-palette',
          routerLink: '/admin/colors',
        },
        {
          label: 'Khách hàng',
          icon: 'pi pi-users',
          routerLink: '/admin/customers',
        },
        {
          label: 'Nhân viên',
          icon: 'pi pi-user-plus',
          routerLink: '/admin/staff',
        },
        {
          label: 'Quản lý kho',
          icon: 'pi pi-database',
          routerLink: '/admin/inventory',
        },
        {
          label: 'Đơn hàng',
          icon: 'pi pi-file-text',
          routerLink: '/admin/orders',
        },
      ],
    },
    {
      label: 'Đăng Nhập',
      icon: 'pi pi-sign-in',
      routerLink: '/login',
    },
  ];

  cartItemCount = 3;
  searchTerm = '';

  onSearch() {
    // Implement search functionality
    console.log('Searching for:', this.searchTerm);
  }
}
