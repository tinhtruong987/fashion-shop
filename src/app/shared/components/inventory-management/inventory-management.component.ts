import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  Inventory,
  InventoryReport,
} from '../../../store/models/inventory.model';
import { InventoryService } from '../../../store/services/inventory.service';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-2xl font-bold text-gray-800">Quản Lý Kho Hàng</h2>
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
              (click)="loadInventory()"
            ></button>
            <button
              pButton
              type="button"
              label="Báo Cáo"
              icon="pi pi-file-pdf"
              class="p-button-warning"
              (click)="generateReport()"
            ></button>
          </ng-template>
          <ng-template pTemplate="right">
            <span class="text-sm text-gray-600">
              Tổng số: {{ inventory.length }} sản phẩm
            </span>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="inventory"
          [loading]="loading"
          [paginator]="true"
          [rows]="15"
          [rowsPerPageOptions]="[10, 15, 25]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} sản phẩm"
          responsiveLayout="scroll"
          styleClass="p-datatable-gridlines"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="ProductVariantID" class="text-center">
                ID Variant <p-sortIcon field="ProductVariantID"></p-sortIcon>
              </th>
              <th pSortableColumn="ProductName">
                Tên Sản Phẩm <p-sortIcon field="ProductName"></p-sortIcon>
              </th>
              <th pSortableColumn="SizeName" class="text-center">
                Kích Cỡ <p-sortIcon field="SizeName"></p-sortIcon>
              </th>
              <th pSortableColumn="ColorName" class="text-center">
                Màu Sắc <p-sortIcon field="ColorName"></p-sortIcon>
              </th>
              <th pSortableColumn="StockQuantity" class="text-center">
                Số Lượng <p-sortIcon field="StockQuantity"></p-sortIcon>
              </th>
              <th pSortableColumn="LastUpdated" class="text-center">
                Cập Nhật <p-sortIcon field="LastUpdated"></p-sortIcon>
              </th>
              <th class="text-center">Trạng Thái</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item>
            <tr>
              <td class="text-center">{{ item.ProductVariantID }}</td>
              <td>
                <span class="font-medium">{{ item.ProductName }}</span>
              </td>
              <td class="text-center">
                <p-tag [value]="item.SizeName" severity="info"></p-tag>
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center space-x-2">
                  <div
                    class="w-6 h-6 rounded-full border"
                    [style.background-color]="getColorHex(item.ColorName)"
                  ></div>
                  <span>{{ item.ColorName }}</span>
                </div>
              </td>
              <td class="text-center">
                <span [class]="getStockClass(item.StockQuantity)">
                  {{ item.StockQuantity }}
                </span>
              </td>
              <td class="text-center">
                {{ item.LastUpdated | date : 'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="text-center">
                <p-tag
                  [value]="getStockStatus(item.StockQuantity)"
                  [severity]="getStockSeverity(item.StockQuantity)"
                ></p-tag>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-8">
                <div class="flex flex-col items-center">
                  <i class="pi pi-box text-4xl text-gray-400 mb-3"></i>
                  <span class="text-gray-500"
                    >Không có sản phẩm nào trong kho</span
                  >
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <p-card>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ getTotalProducts() }}
            </div>
            <div class="text-sm text-gray-600">Tổng Sản Phẩm</div>
          </div>
        </p-card>
        <p-card>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ getInStockCount() }}
            </div>
            <div class="text-sm text-gray-600">Có Hàng</div>
          </div>
        </p-card>
        <p-card>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ getLowStockCount() }}
            </div>
            <div class="text-sm text-gray-600">Sắp Hết</div>
          </div>
        </p-card>
        <p-card>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ getOutOfStockCount() }}
            </div>
            <div class="text-sm text-gray-600">Hết Hàng</div>
          </div>
        </p-card>
      </div>

      <p-toast></p-toast>
    </div>
  `,
  styles: [
    `
      .stock-high {
        color: #22c55e;
        font-weight: bold;
      }
      .stock-low {
        color: #f59e0b;
        font-weight: bold;
      }
      .stock-out {
        color: #ef4444;
        font-weight: bold;
      }
    `,
  ],
})
export class InventoryManagementComponent implements OnInit {
  inventory: Inventory[] = [];
  loading = false;

  private colorMap: { [key: string]: string } = {
    đỏ: '#dc2626',
    'xanh dương': '#2563eb',
    đen: '#1f2937',
    trắng: '#f9fafb',
    xám: '#6b7280',
    vàng: '#eab308',
    'xanh lá': '#16a34a',
    hồng: '#ec4899',
  };

  constructor(
    private inventoryService: InventoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getInventory().subscribe({
      next: (inventory) => {
        this.inventory = inventory;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách kho hàng',
        });
        this.loading = false;
      },
    });
  }
  generateReport(): void {
    this.inventoryService.generateInventoryReport().subscribe({
      next: (reports: InventoryReport[]) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Báo cáo đã được tạo thành công',
        });
        console.log('Inventory Report:', reports);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tạo báo cáo',
        });
      },
    });
  }

  getColorHex(colorName: string): string {
    const normalizedName = colorName.toLowerCase().trim();
    return this.colorMap[normalizedName] || '#6b7280';
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Hết hàng';
    if (quantity <= 5) return 'Sắp hết';
    return 'Còn hàng';
  }

  getStockSeverity(quantity: number): 'success' | 'warning' | 'danger' {
    if (quantity === 0) return 'danger';
    if (quantity <= 5) return 'warning';
    return 'success';
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) return 'stock-out';
    if (quantity <= 5) return 'stock-low';
    return 'stock-high';
  }

  getTotalProducts(): number {
    return this.inventory.length;
  }
  getInStockCount(): number {
    return this.inventory.filter((item) => item.Stock > 5).length;
  }

  getLowStockCount(): number {
    return this.inventory.filter((item) => item.Stock > 0 && item.Stock <= 5)
      .length;
  }

  getOutOfStockCount(): number {
    return this.inventory.filter((item) => item.Stock === 0).length;
  }
}
