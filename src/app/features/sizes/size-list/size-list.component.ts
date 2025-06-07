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
import { Size } from '../../../core/models/size.model';
import { MOCK_SIZES } from '../../../core/mock/sizes.mock';

@Component({
  selector: 'app-size-list',
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
        <h1 class="text-2xl font-bold">Danh sách kích thước</h1>
        <p-button
          label="Thêm kích thước"
          icon="pi pi-plus"
          routerLink="/admin/sizes/new"
        ></p-button>
      </div>

      <p-table
        [value]="sizes"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} kích thước"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['sizeName']"
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
            <th pSortableColumn="sizeName">
              Tên kích thước <p-sortIcon field="sizeName"></p-sortIcon>
            </th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style="width: 8rem">Thao tác</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-size>
          <tr>
            <td>{{ size.sizeName }}</td>
            <td>
              <p-tag
                [severity]="size.isActive ? 'success' : 'danger'"
                [value]="size.isActive ? 'Hoạt động' : 'Không hoạt động'"
              ></p-tag>
            </td>
            <td>{{ size.createdAt | date : 'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-success"
                  icon="pi pi-pencil"
                  [pTooltip]="'Sửa'"
                  routerLink="/admin/sizes/{{ size.sizeID }}/edit"
                ></button>
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-danger"
                  icon="pi pi-trash"
                  [pTooltip]="'Xóa'"
                  (click)="confirmDelete(size)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center p-4">Không có kích thước nào</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class SizeListComponent implements OnInit {
  sizes: Size[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // TODO: Replace with actual API call
    this.sizes = MOCK_SIZES;
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    // TODO: Implement filtering
  }

  confirmDelete(size: Size) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa kích thước "${size.sizeName}"?`,
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa kích thước thành công',
        });
      },
    });
  }
}
