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
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  Size,
  CreateSizeRequest,
  UpdateSizeRequest,
} from '../../../store/models/size.model';
import { SizeService } from '../../../store/services/size.service';

@Component({
  selector: 'app-size-management',
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
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto p-6">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-2xl font-bold text-gray-800">Quản Lý Kích Cỡ</h2>
          </div>
        </ng-template>

        <p-toolbar class="mb-4">
          <ng-template pTemplate="left">
            <p-button
              label="Thêm Kích Cỡ"
              icon="pi pi-plus"
              (onClick)="openNew()"
              styleClass="mr-2"
            >
            </p-button>
          </ng-template>

          <ng-template pTemplate="right">
            <p-button
              label="Làm mới"
              icon="pi pi-refresh"
              severity="secondary"
              (onClick)="loadSizes()"
            >
            </p-button>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="sizes"
          [paginator]="true"
          [rows]="10"
          [loading]="loading"
          responsiveLayout="scroll"
          [globalFilterFields]="['SizeName']"
          #dt
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">Danh sách kích cỡ</span>
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  (input)="
                    dt.filterGlobal($any($event.target).value, 'contains')
                  "
                  placeholder="Tìm kiếm kích cỡ..."
                />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th style="width: 80px">ID</th>
              <th>Tên Kích Cỡ</th>
              <th style="width: 120px">Trạng Thái</th>
              <th style="width: 180px">Ngày Tạo</th>
              <th style="width: 120px">Thao Tác</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-size>
            <tr>
              <td>{{ size.SizeID }}</td>
              <td>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {{ size.SizeName }}
                </span>
              </td>
              <td>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  [class]="
                    size.IsActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ size.IsActive ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </td>
              <td>{{ size.CreatedAt | date : 'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    (onClick)="editSize(size)"
                    pTooltip="Chỉnh sửa"
                  >
                  </p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    (onClick)="deleteSize(size)"
                    pTooltip="Xóa"
                  >
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-8">
                <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">Không có kích cỡ nào</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Add/Edit Dialog -->
      <p-dialog
        [header]="isEditing ? 'Chỉnh Sửa Kích Cỡ' : 'Thêm Kích Cỡ Mới'"
        [(visible)]="sizeDialog"
        [style]="{ width: '450px' }"
        [modal]="true"
        styleClass="p-fluid"
      >
        <form [formGroup]="sizeForm" (ngSubmit)="saveSize()">
          <div class="field">
            <label
              for="sizeName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên Kích Cỡ <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sizeName"
              pInputText
              formControlName="sizeName"
              placeholder="Ví dụ: S, M, L, XL..."
              autofocus
              [class.ng-invalid]="
                sizeForm.get('sizeName')?.invalid &&
                sizeForm.get('sizeName')?.touched
              "
            />

            <small
              class="text-red-500"
              *ngIf="
                sizeForm.get('sizeName')?.invalid &&
                sizeForm.get('sizeName')?.touched
              "
            >
              Tên kích cỡ là bắt buộc
            </small>
          </div>

          <div class="field" *ngIf="isEditing">
            <label class="flex items-center">
              <input type="checkbox" formControlName="isActive" class="mr-2" />
              <span class="text-sm font-medium text-gray-700"
                >Kích hoạt kích cỡ</span
              >
            </label>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <div class="flex justify-end gap-2">
            <p-button
              label="Hủy"
              icon="pi pi-times"
              severity="secondary"
              (onClick)="hideDialog()"
            >
            </p-button>
            <p-button
              [label]="isEditing ? 'Cập nhật' : 'Thêm mới'"
              icon="pi pi-check"
              (onClick)="saveSize()"
              [disabled]="sizeForm.invalid"
              [loading]="saving"
            >
            </p-button>
          </div>
        </ng-template>
      </p-dialog>

      <p-confirmDialog></p-confirmDialog>
      <p-toast></p-toast>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .p-datatable .p-datatable-tbody > tr > td {
        padding: 1rem;
      }

      .p-toolbar {
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }

      .field {
        margin-bottom: 1.5rem;
      }

      .ng-invalid.ng-touched {
        border-color: #ef4444 !important;
      }
    `,
  ],
})
export class SizeManagementComponent implements OnInit {
  sizes: Size[] = [];
  sizeDialog = false;
  sizeForm!: FormGroup;
  isEditing = false;
  selectedSize: Size | null = null;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private sizeService: SizeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSizes();
  }

  private initForm(): void {
    this.sizeForm = this.fb.group({
      sizeName: ['', [Validators.required, Validators.minLength(1)]],
      isActive: [true],
    });
  }

  loadSizes(): void {
    this.loading = true;
    this.sizeService.getSizes().subscribe({
      next: (data) => {
        this.sizes = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách kích cỡ',
        });
        this.loading = false;
      },
    });
  }

  openNew(): void {
    this.selectedSize = null;
    this.isEditing = false;
    this.sizeForm.reset();
    this.sizeForm.patchValue({ isActive: true });
    this.sizeDialog = true;
  }

  editSize(size: Size): void {
    this.selectedSize = { ...size };
    this.isEditing = true;
    this.sizeForm.patchValue({
      sizeName: size.SizeName,
      isActive: size.IsActive,
    });
    this.sizeDialog = true;
  }

  hideDialog(): void {
    this.sizeDialog = false;
    this.sizeForm.reset();
    this.selectedSize = null;
  }

  saveSize(): void {
    if (this.sizeForm.valid) {
      this.saving = true;
      const formValue = this.sizeForm.value;

      if (this.isEditing && this.selectedSize) {
        const updateRequest: UpdateSizeRequest = {
          SizeID: this.selectedSize.SizeID,
          SizeName: formValue.sizeName,
          IsActive: formValue.isActive,
        };

        this.sizeService.updateSize(updateRequest).subscribe({
          next: (updatedSize) => {
            const index = this.sizes.findIndex(
              (s) => s.SizeID === updatedSize.SizeID
            );
            if (index !== -1) {
              this.sizes[index] = updatedSize;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Kích cỡ đã được cập nhật',
            });

            this.hideDialog();
            this.saving = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật kích cỡ',
            });
            this.saving = false;
          },
        });
      } else {
        const createRequest: CreateSizeRequest = {
          SizeName: formValue.sizeName,
        };

        this.sizeService.createSize(createRequest).subscribe({
          next: (newSize) => {
            this.sizes.push(newSize);

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Kích cỡ mới đã được thêm',
            });

            this.hideDialog();
            this.saving = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể thêm kích cỡ mới',
            });
            this.saving = false;
          },
        });
      }
    }
  }

  deleteSize(size: Size): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa kích cỡ "${size.SizeName}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        this.sizeService.deleteSize(size.SizeID).subscribe({
          next: () => {
            this.sizes = this.sizes.filter((s) => s.SizeID !== size.SizeID);

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Kích cỡ đã được xóa',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa kích cỡ',
            });
          },
        });
      },
    });
  }
}
