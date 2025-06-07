import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Sales Card -->
        <p-card header="Bán hàng" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-shopping-cart text-4xl text-blue-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Quản lý bán hàng và thanh toán</p>
              <p-button
                label="Vào POS"
                routerLink="/sales"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>

        <!-- Products Card -->
        <p-card header="Sản phẩm" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-box text-4xl text-green-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Quản lý sản phẩm và tồn kho</p>
              <p-button
                label="Quản lý"
                routerLink="/admin/products"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>

        <!-- Statistics Card -->
        <p-card header="Thống kê" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-chart-bar text-4xl text-purple-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Xem báo cáo và thống kê</p>
              <p-button
                label="Xem báo cáo"
                routerLink="/admin/statistics"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>

        <!-- Customers Card -->
        <p-card header="Khách hàng" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-users text-4xl text-orange-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Quản lý thông tin khách hàng</p>
              <p-button
                label="Quản lý"
                routerLink="/admin/customers"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>

        <!-- Staff Card -->
        <p-card header="Nhân viên" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-user text-4xl text-red-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Quản lý thông tin nhân viên</p>
              <p-button
                label="Quản lý"
                routerLink="/admin/staff"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>

        <!-- Settings Card -->
        <p-card header="Cài đặt" styleClass="shadow-lg">
          <ng-template pTemplate="content">
            <div class="text-center">
              <i class="pi pi-cog text-4xl text-gray-500 mb-4"></i>
              <p class="text-gray-600 mb-4">Cài đặt hệ thống</p>
              <p-button
                label="Cài đặt"
                routerLink="/admin/settings"
                icon="pi pi-arrow-right"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
})
export class HomeComponent {}
