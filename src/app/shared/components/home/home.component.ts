import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    RippleModule,
    ChartModule,
    AvatarModule,
    BadgeModule,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"
        ></div>
        <div
          class="relative container mx-auto px-4 py-20 text-center text-white"
        >
          <h1 class="text-5xl font-bold mb-6">Hệ Thống Quản Lý Bán Hàng</h1>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Giải pháp toàn diện cho việc quản lý sản phẩm, bán hàng và khách
            hàng
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <p-button
              label="Bắt Đầu Bán Hàng"
              icon="pi pi-shopping-cart"
              routerLink="/sales"
              [style]="{
                background: 'white',
                color: '#3B82F6',
                border: '2px solid white'
              }"
              styleClass="text-lg px-8 py-3"
            >
            </p-button>
            <p-button
              label="Quản Lý Sản Phẩm"
              icon="pi pi-box"
              routerLink="/admin/products"
              severity="secondary"
              [outlined]="true"
              styleClass="text-lg px-8 py-3 text-white border-white"
            >
            </p-button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          Tính Năng Chính
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- POS Feature -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-green-500 to-teal-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-shopping-cart text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Bán Hàng (POS)</h3>
            <p class="text-gray-600 mb-4">
              Giao diện bán hàng trực quan, xử lý thanh toán nhanh chóng và in
              hóa đơn tự động.
            </p>
            <p-button
              label="Vào Bán Hàng"
              icon="pi pi-arrow-right"
              routerLink="/sales"
              styleClass="w-full"
            >
            </p-button>
          </p-card>

          <!-- Product Management -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-box text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              Quản Lý Sản Phẩm
            </h3>
            <p class="text-gray-600 mb-4">
              Thêm, sửa, xóa sản phẩm. Quản lý kích cỡ, màu sắc và tồn kho một
              cách dễ dàng.
            </p>
            <p-button
              label="Quản Lý"
              icon="pi pi-arrow-right"
              routerLink="/admin/products"
              styleClass="w-full"
            >
            </p-button>
          </p-card>

          <!-- Customer Management -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-users text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              Quản Lý Khách Hàng
            </h3>
            <p class="text-gray-600 mb-4">
              Theo dõi thông tin khách hàng, điểm thưởng và lịch sử mua hàng.
            </p>
            <p-button
              label="Quản Lý"
              icon="pi pi-arrow-right"
              routerLink="/admin/customers"
              styleClass="w-full"
            >
            </p-button>
          </p-card>

          <!-- Analytics -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-orange-500 to-red-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-chart-bar text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              Thống Kê & Báo Cáo
            </h3>
            <p class="text-gray-600 mb-4">
              Xem báo cáo doanh thu, sản phẩm bán chạy và phân tích xu hướng.
            </p>
            <p-button
              label="Xem Báo Cáo"
              icon="pi pi-arrow-right"
              routerLink="/sales/dashboard"
              styleClass="w-full"
            >
            </p-button>
          </p-card>

          <!-- Inventory -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-teal-500 to-cyan-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-database text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Quản Lý Kho</h3>
            <p class="text-gray-600 mb-4">
              Theo dõi tồn kho, cảnh báo hết hàng và quản lý nhập xuất kho.
            </p>
            <p-button
              label="Quản Lý Kho"
              icon="pi pi-arrow-right"
              routerLink="/admin/inventory"
              styleClass="w-full"
            >
            </p-button>
          </p-card>

          <!-- Staff Management -->
          <p-card
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ng-template pTemplate="header">
              <div
                class="bg-gradient-to-r from-indigo-500 to-blue-600 h-48 flex items-center justify-center"
              >
                <i class="pi pi-user-plus text-6xl text-white"></i>
              </div>
            </ng-template>
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              Quản Lý Nhân Viên
            </h3>
            <p class="text-gray-600 mb-4">
              Quản lý tài khoản nhân viên, phân quyền và theo dõi hoạt động.
            </p>
            <p-button
              label="Quản Lý"
              icon="pi pi-arrow-right"
              routerLink="/admin/staff"
              styleClass="w-full"
            >
            </p-button>
          </p-card>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
            Thống Kê Nhanh
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div
                class="bg-blue-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <i class="pi pi-shopping-bag text-3xl text-blue-600"></i>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">1,234</h3>
              <p class="text-gray-600">Đơn Hàng Hôm Nay</p>
            </div>

            <div class="text-center">
              <div
                class="bg-green-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <i class="pi pi-dollar text-3xl text-green-600"></i>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">45.6M</h3>
              <p class="text-gray-600">Doanh Thu Tháng</p>
            </div>

            <div class="text-center">
              <div
                class="bg-purple-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <i class="pi pi-users text-3xl text-purple-600"></i>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">856</h3>
              <p class="text-gray-600">Khách Hàng Mới</p>
            </div>

            <div class="text-center">
              <div
                class="bg-orange-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <i class="pi pi-box text-3xl text-orange-600"></i>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">432</h3>
              <p class="text-gray-600">Sản Phẩm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .p-card:hover {
        transform: translateY(-4px);
        transition: transform 0.3s ease-in-out;
      }

      .p-button {
        transition: all 0.3s ease;
      }

      .p-button:hover {
        transform: translateY(-2px);
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
