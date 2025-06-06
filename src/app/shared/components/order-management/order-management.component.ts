import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { Order, OrderItem } from '../../../store/models/order.model';
import { OrderService } from '../../../store/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    ToastModule,
    DialogModule,
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h2>
          </div>
        </ng-template>

        <p-toolbar class="mb-4">
          <ng-template pTemplate="left">
            <button
              pButton
              type="button"
              label="Làm Mới"
              icon="pi pi-refresh"
              class="p-button-info mr-2"
              (click)="loadOrders()"
            ></button>
          </ng-template>
          <ng-template pTemplate="right">
            <span class="text-sm text-gray-600">
              Tổng số: {{ orders.length }} đơn hàng
            </span>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="orders"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} đơn hàng"
          responsiveLayout="scroll"
          styleClass="p-datatable-gridlines"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="OrderID" class="text-center">
                Mã ĐH <p-sortIcon field="OrderID"></p-sortIcon>
              </th>
              <th pSortableColumn="Customer">
                Khách Hàng <p-sortIcon field="Customer"></p-sortIcon>
              </th>
              <th pSortableColumn="OrderDate" class="text-center">
                Ngày Đặt <p-sortIcon field="OrderDate"></p-sortIcon>
              </th>
              <th pSortableColumn="TotalAmount" class="text-center">
                Tổng Tiền <p-sortIcon field="TotalAmount"></p-sortIcon>
              </th>
              <th pSortableColumn="Status" class="text-center">
                Trạng Thái <p-sortIcon field="Status"></p-sortIcon>
              </th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-order>
            <tr>
              <td class="text-center">
                <span class="font-mono">#{{ order.OrderID }}</span>
              </td>
              <td>
                <span class="font-medium">{{
                  order.Customer?.FullName || 'Khách lẻ'
                }}</span>
              </td>
              <td class="text-center">
                {{ order.OrderDate | date : 'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="text-center">
                <span class="font-bold text-green-600">
                  {{
                    order.TotalAmount | currency : 'VND' : 'symbol' : '1.0-0'
                  }}
                </span>
              </td>
              <td class="text-center">
                <p-tag
                  [value]="getStatusText(order.Status)"
                  [severity]="getStatusSeverity(order.Status)"
                ></p-tag>
              </td>
              <td class="text-center">
                <button
                  pButton
                  type="button"
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-info mr-1"
                  (click)="viewOrderDetails(order)"
                  title="Xem chi tiết"
                ></button>
                <button
                  pButton
                  type="button"
                  icon="pi pi-file-pdf"
                  class="p-button-rounded p-button-text p-button-warning"
                  (click)="printOrder(order)"
                  title="In hóa đơn"
                ></button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="flex flex-col items-center">
                  <i
                    class="pi pi-shopping-cart text-4xl text-gray-400 mb-3"
                  ></i>
                  <span class="text-gray-500">Không có đơn hàng nào</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Order Details Dialog -->
      <p-dialog
        [(visible)]="displayOrderDetails"
        header="Chi Tiết Đơn Hàng"
        [modal]="true"
        [style]="{ width: '800px' }"
        [closable]="true"
        [closeOnEscape]="true"
      >
        <div *ngIf="selectedOrder" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <strong>Mã đơn hàng:</strong> #{{ selectedOrder.OrderID }}
            </div>
            <div>
              <strong>Ngày đặt:</strong>
              {{ selectedOrder.OrderDate | date : 'dd/MM/yyyy HH:mm' }}
            </div>
            <div>
              <strong>Khách hàng:</strong>
              {{ selectedOrder.Customer?.FullName || 'Khách lẻ' }}
            </div>
            <div>
              <strong>Trạng thái:</strong>
              <p-tag
                [value]="getStatusText(selectedOrder.Status)"
                [severity]="getStatusSeverity(selectedOrder.Status)"
                class="ml-2"
              ></p-tag>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-3">Sản Phẩm Đã Đặt</h4>
            <p-table [value]="selectedOrderItems" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Sản Phẩm</th>
                  <th class="text-center">Kích Cỡ</th>
                  <th class="text-center">Màu</th>
                  <th class="text-center">SL</th>
                  <th class="text-center">Giá</th>
                  <th class="text-center">Thành Tiền</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>{{ item.ProductName }}</td>
                  <td class="text-center">{{ item.SizeName }}</td>
                  <td class="text-center">{{ item.ColorName }}</td>
                  <td class="text-center">{{ item.Quantity }}</td>
                  <td class="text-center">
                    {{ item.UnitPrice | currency : 'VND' : 'symbol' : '1.0-0' }}
                  </td>
                  <td class="text-center">
                    {{ item.Subtotal | currency : 'VND' : 'symbol' : '1.0-0' }}
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div class="text-right">
            <div class="text-xl font-bold">
              Tổng cộng:
              {{
                selectedOrder.TotalAmount
                  | currency : 'VND' : 'symbol' : '1.0-0'
              }}
            </div>
          </div>
        </div>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedOrderItems: OrderItem[] = [];
  loading = false;
  displayOrderDetails = false;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách đơn hàng',
        });
        this.loading = false;
      },
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.orderService.getOrderItems(order.OrderID).subscribe({
      next: (items: OrderItem[]) => {
        this.selectedOrderItems = items;
        this.displayOrderDetails = true;
      },
      error: (error: any) => {
        console.error('Error loading order items:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải chi tiết đơn hàng',
        });
      },
    });
  }

  printOrder(order: Order): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: `Đang chuẩn bị in hóa đơn #${order.OrderID}`,
    });
    // Implement print functionality here
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      Pending: 'Chờ xử lý',
      Processing: 'Đang xử lý',
      Shipped: 'Đã gửi',
      Delivered: 'Đã giao',
      Cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    const severityMap: {
      [key: string]: 'success' | 'warning' | 'danger' | 'info';
    } = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'info',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return severityMap[status] || 'info';
  }
}
