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
import { Staff } from '../../../core/models/staff.model';

@Component({
  selector: 'app-staff-list',
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
        <h1 class="text-2xl font-bold">Danh sách nhân viên</h1>
        <p-button
          label="Thêm nhân viên"
          icon="pi pi-plus"
          routerLink="/admin/staff/new"
        ></p-button>
      </div>

      <p-table
        [value]="staff"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} nhân viên"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['name', 'position']"
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
            <th pSortableColumn="name">
              Họ tên <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="position">
              Vị trí <p-sortIcon field="position"></p-sortIcon>
            </th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style="width: 8rem">Thao tác</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-staff>
          <tr>
            <td>{{ staff.name }}</td>
            <td>{{ staff.position }}</td>
            <td>
              <p-tag
                [severity]="
                  staff.userAccount?.role === 'Admin' ? 'danger' : 'info'
                "
                [value]="
                  staff.userAccount?.role === 'Admin'
                    ? 'Quản trị viên'
                    : 'Nhân viên'
                "
              ></p-tag>
            </td>
            <td>
              <p-tag
                [severity]="staff.isActive ? 'success' : 'danger'"
                [value]="staff.isActive ? 'Hoạt động' : 'Không hoạt động'"
              ></p-tag>
            </td>
            <td>{{ staff.createdAt | date : 'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-success"
                  icon="pi pi-pencil"
                  [pTooltip]="'Sửa'"
                  routerLink="/admin/staff/{{ staff.staffID }}/edit"
                ></button>
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-rounded p-button-text p-button-danger"
                  icon="pi pi-trash"
                  [pTooltip]="'Xóa'"
                  (click)="confirmDelete(staff)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4">Không có nhân viên nào</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class StaffListComponent implements OnInit {
  staff: Staff[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // TODO: Replace with actual API call
    this.staff = [];
  }

  applyFilterGlobal(event: Event, matchMode: string) {
    // TODO: Implement filtering
  }

  confirmDelete(staff: Staff) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa nhân viên "${staff.name}"?`,
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa nhân viên thành công',
        });
      },
    });
  }
}
