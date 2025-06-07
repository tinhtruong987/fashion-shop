import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../core/models/product.model';
import { MOCK_PRODUCTS } from '../../../core/mock/products.mock';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Danh sách sản phẩm</h1>
        <p-button
          label="Thêm sản phẩm"
          icon="pi pi-plus"
          routerLink="/admin/products/new"
        ></p-button>
      </div>

      <p-table
        [value]="products"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} sản phẩm"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['name', 'productCode', 'category.categoryName']"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="caption">
          <div class="flex justify-between items-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                pInputText
                type="text"
                (input)="applyFilterGlobal($event, 'contains')"
                placeholder="Tìm kiếm..."
                class="p-inputtext-sm"
              />
            </span>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem"></th>
            <th pSortableColumn="productCode">
              Mã sản phẩm <p-sortIcon field="productCode"></p-sortIcon>
            </th>
            <th pSortableColumn="name">
              Tên sản phẩm <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="category.categoryName">
              Danh mục <p-sortIcon field="category.categoryName"></p-sortIcon>
            </th>
            <th pSortableColumn="price">
              Giá <p-sortIcon field="price"></p-sortIcon>
            </th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th style="width: 8rem">Thao tác</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-product>
          <tr>
            <td>
              <button
                pButton
                pRipple
                type="button"
                class="p-button-rounded p-button-text"
                icon="pi pi-chevron-right"
                (click)="toggleRow(product)"
                [pTooltip]="'Xem chi tiết'"
              ></button>
            </td>
            <td>{{ product.productCode }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category?.categoryName }}</td>
            <td>{{ product.price | currency : 'VND' }}</td>
            <td>{{ getTotalStock(product) }}</td>
            <td>
              <p-tag
                [severity]="product.isActive ? 'success' : 'danger'"
                [value]="product.isActive ? 'Hoạt động' : 'Không hoạt động'"
              ></p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-success"
                  icon="pi pi-pencil"
                  [pTooltip]="'Sửa'"
                  routerLink="/admin/products/{{ product.productID }}/edit"
                ></button>
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-danger"
                  icon="pi pi-trash"
                  [pTooltip]="'Xóa'"
                  (click)="confirmDelete(product)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="8" class="text-center p-4">Không có sản phẩm nào</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // TODO: Replace with actual API call
    this.products = MOCK_PRODUCTS;
  }

  getTotalStock(product: Product): number {
    return product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  }

  toggleRow(product: Product) {
    // TODO: Implement row expansion
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    // TODO: Implement filtering
  }

  confirmDelete(product: Product) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa sản phẩm thành công',
        });
      },
    });
  }
}
