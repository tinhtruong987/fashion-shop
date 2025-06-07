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
import { Color } from '../../../core/models/color.model';
import { MOCK_COLORS } from '../../../core/mock/colors.mock';

@Component({
  selector: 'app-color-list',
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
        <h1 class="text-2xl font-bold">Danh sách màu sắc</h1>
        <p-button
          label="Thêm màu sắc"
          icon="pi pi-plus"
          routerLink="/admin/colors/new"
        ></p-button>
      </div>

      <p-table
        [value]="colors"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} màu sắc"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['colorName']"
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
            <th pSortableColumn="colorName">
              Tên màu sắc <p-sortIcon field="colorName"></p-sortIcon>
            </th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style="width: 8rem">Thao tác</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-color>
          <tr>
            <td>{{ color.colorName }}</td>
            <td>
              <p-tag
                [severity]="color.isActive ? 'success' : 'danger'"
                [value]="color.isActive ? 'Hoạt động' : 'Không hoạt động'"
              ></p-tag>
            </td>
            <td>{{ color.createdAt | date : 'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-success"
                  icon="pi pi-pencil"
                  [pTooltip]="'Sửa'"
                  routerLink="/admin/colors/{{ color.colorID }}/edit"
                ></button>
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-danger"
                  icon="pi pi-trash"
                  [pTooltip]="'Xóa'"
                  (click)="confirmDelete(color)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center p-4">Không có màu sắc nào</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ColorListComponent implements OnInit {
  colors: Color[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // TODO: Replace with actual API call
    this.colors = MOCK_COLORS;
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    // TODO: Implement filtering
  }

  confirmDelete(color: Color) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa màu sắc "${color.colorName}"?`,
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa màu sắc thành công',
        });
      },
    });
  }
}
