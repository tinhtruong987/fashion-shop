import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  Staff,
  CreateStaffRequest,
  UpdateStaffRequest,
} from '../../../store/models/staff.model';
import { StaffService } from '../../../store/services/staff.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto p-6">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-2xl font-bold text-gray-800">Quản Lý Nhân Viên</h2>
          </div>
        </ng-template>

        <p-toolbar class="mb-4">
          <ng-template pTemplate="left">
            <button
              pButton
              type="button"
              label="Thêm Nhân Viên"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              (click)="showCreateDialog()"
            ></button>
          </ng-template>
          <ng-template pTemplate="right">
            <span class="text-sm text-gray-600">
              Tổng số: {{ staff.length }} nhân viên
            </span>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="staff"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} nhân viên"
          [globalFilterFields]="['Name', 'Position']"
          responsiveLayout="scroll"
          styleClass="p-datatable-gridlines"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="StaffID" class="text-center">
                ID <p-sortIcon field="StaffID"></p-sortIcon>
              </th>
              <th pSortableColumn="Name">
                Họ Tên <p-sortIcon field="Name"></p-sortIcon>
              </th>
              <th pSortableColumn="Position">
                Chức Vụ <p-sortIcon field="Position"></p-sortIcon>
              </th>
              <th pSortableColumn="IsActive" class="text-center">
                Trạng Thái <p-sortIcon field="IsActive"></p-sortIcon>
              </th>
              <th pSortableColumn="CreatedAt" class="text-center">
                Ngày Tạo <p-sortIcon field="CreatedAt"></p-sortIcon>
              </th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-staffMember>
            <tr>
              <td class="text-center">{{ staffMember.StaffID }}</td>
              <td>
                <span class="font-medium">{{ staffMember.Name }}</span>
              </td>
              <td>
                <span class="text-sm">{{
                  staffMember.Position || 'Chưa xác định'
                }}</span>
              </td>
              <td class="text-center">
                <p-tag
                  [value]="
                    staffMember.IsActive ? 'Hoạt động' : 'Ngừng hoạt động'
                  "
                  [severity]="staffMember.IsActive ? 'success' : 'danger'"
                ></p-tag>
              </td>
              <td class="text-center">
                {{ staffMember.CreatedAt | date : 'dd/MM/yyyy' }}
              </td>
              <td class="text-center">
                <button
                  pButton
                  type="button"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-warning mr-1"
                  (click)="showEditDialog(staffMember)"
                  [title]="'Sửa ' + staffMember.Name"
                ></button>
                <button
                  pButton
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="confirmDelete(staffMember)"
                  [title]="'Xóa ' + staffMember.Name"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Create/Edit Dialog -->
      <p-dialog
        [(visible)]="displayDialog"
        [header]="isEditMode ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới'"
        [modal]="true"
        [style]="{ width: '500px' }"
        [closable]="true"
        [closeOnEscape]="true"
      >
        <form
          [formGroup]="staffForm"
          (ngSubmit)="saveStaff()"
          class="space-y-4"
        >
          <div class="field" *ngIf="!isEditMode">
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên đăng nhập <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              pInputText
              formControlName="Username"
              placeholder="Nhập tên đăng nhập"
              class="w-full"
            />
          </div>

          <div class="field" *ngIf="!isEditMode">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Mật khẩu <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              pInputText
              formControlName="Password"
              placeholder="Nhập mật khẩu"
              class="w-full"
            />
          </div>

          <div class="field" *ngIf="!isEditMode">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="Email"
              placeholder="Nhập địa chỉ email"
              class="w-full"
            />
          </div>

          <div class="field" *ngIf="!isEditMode">
            <label
              for="role"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Vai trò <span class="text-red-500">*</span>
            </label>
            <p-dropdown
              id="role"
              formControlName="Role"
              [options]="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn vai trò"
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="field">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Họ và tên <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              pInputText
              formControlName="Name"
              placeholder="Nhập họ và tên"
              class="w-full"
            />
          </div>

          <div class="field">
            <label
              for="position"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Chức vụ
            </label>
            <input
              id="position"
              type="text"
              pInputText
              formControlName="Position"
              placeholder="Nhập chức vụ"
              class="w-full"
            />
          </div>

          <div class="field" *ngIf="isEditMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trạng Thái
            </label>
            <div class="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                formControlName="IsActive"
                class="mr-2"
              />
              <label for="isActive" class="text-sm">Hoạt động</label>
            </div>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <div class="flex justify-end space-x-2">
            <button
              pButton
              type="button"
              label="Hủy"
              icon="pi pi-times"
              class="p-button-text"
              (click)="hideDialog()"
            ></button>
            <button
              pButton
              type="button"
              [label]="isEditMode ? 'Cập Nhật' : 'Thêm Mới'"
              icon="pi pi-check"
              [loading]="submitting"
              (click)="saveStaff()"
              [disabled]="staffForm.invalid"
            ></button>
          </div>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
})
export class StaffManagementComponent implements OnInit {
  staff: Staff[] = [];
  loading = false;
  submitting = false;
  displayDialog = false;
  isEditMode = false;
  selectedStaff: Staff | null = null;
  staffForm: FormGroup;

  roleOptions = [
    { label: 'Quản lý', value: 'Admin' },
    { label: 'Nhân viên', value: 'Staff' },
  ];

  constructor(
    private staffService: StaffService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.staffForm = this.formBuilder.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Email: ['', [Validators.required, Validators.email]],
      Role: ['Staff', [Validators.required]],
      Name: ['', [Validators.required]],
      Position: [''],
      IsActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.loading = true;
    this.staffService.getStaff().subscribe({
      next: (staff) => {
        this.staff = staff;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading staff:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách nhân viên',
        });
        this.loading = false;
      },
    });
  }

  showCreateDialog(): void {
    this.isEditMode = false;
    this.selectedStaff = null;
    this.staffForm.reset({ Role: 'Staff', IsActive: true });
    this.updateValidators();
    this.displayDialog = true;
  }

  showEditDialog(staff: Staff): void {
    this.isEditMode = true;
    this.selectedStaff = staff;
    this.staffForm.patchValue({
      Name: staff.Name,
      Position: staff.Position,
      IsActive: staff.IsActive,
    });
    this.updateValidators();
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.staffForm.reset();
    this.selectedStaff = null;
  }

  updateValidators(): void {
    const requiredFields = ['Username', 'Password', 'Email', 'Role'];
    requiredFields.forEach((field) => {
      const control = this.staffForm.get(field);
      if (this.isEditMode) {
        control?.clearValidators();
      } else {
        if (field === 'Email') {
          control?.setValidators([Validators.required, Validators.email]);
        } else if (field === 'Password') {
          control?.setValidators([
            Validators.required,
            Validators.minLength(6),
          ]);
        } else {
          control?.setValidators([Validators.required]);
        }
      }
      control?.updateValueAndValidity();
    });
  }

  saveStaff(): void {
    if (this.staffForm.invalid) {
      Object.keys(this.staffForm.controls).forEach((key) => {
        this.staffForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.selectedStaff) {
      const updateRequest: UpdateStaffRequest = {
        StaffID: this.selectedStaff.StaffID,
        Name: this.staffForm.value.Name.trim(),
        Position: this.staffForm.value.Position?.trim(),
        IsActive: this.staffForm.value.IsActive,
      };

      this.staffService.updateStaff(updateRequest).subscribe({
        next: (updatedStaff) => {
          const index = this.staff.findIndex(
            (s) => s.StaffID === updatedStaff.StaffID
          );
          if (index !== -1) {
            this.staff[index] = updatedStaff;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật nhân viên thành công',
          });
          this.hideDialog();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating staff:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật nhân viên',
          });
          this.submitting = false;
        },
      });
    } else {
      const createRequest: CreateStaffRequest = {
        Username: this.staffForm.value.Username.trim(),
        Password: this.staffForm.value.Password,
        Email: this.staffForm.value.Email.trim(),
        Role: this.staffForm.value.Role,
        Name: this.staffForm.value.Name.trim(),
        Position: this.staffForm.value.Position?.trim(),
      };

      this.staffService.createStaff(createRequest).subscribe({
        next: (newStaff) => {
          this.staff.push(newStaff);
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm nhân viên mới thành công',
          });
          this.hideDialog();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creating staff:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể thêm nhân viên mới',
          });
          this.submitting = false;
        },
      });
    }
  }

  confirmDelete(staff: Staff): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa nhân viên "${staff.Name}"?`,
      header: 'Xác Nhận Xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        this.deleteStaff(staff.StaffID);
      },
    });
  }

  deleteStaff(staffId: number): void {
    this.staffService.deleteStaff(staffId).subscribe({
      next: () => {
        this.staff = this.staff.filter((s) => s.StaffID !== staffId);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa nhân viên thành công',
        });
      },
      error: (error) => {
        console.error('Error deleting staff:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa nhân viên',
        });
      },
    });
  }
}
