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
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  Color,
  CreateColorRequest,
  UpdateColorRequest,
} from '../../../store/models/color.model';
import { ColorService } from '../../../store/services/color.service';

@Component({
  selector: 'app-color-management',
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
    ColorPickerModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto p-6">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-2xl font-bold text-gray-800">Quản Lý Màu Sắc</h2>
          </div>
        </ng-template>

        <p-toolbar class="mb-4">
          <ng-template pTemplate="left">
            <button
              pButton
              type="button"
              label="Thêm Màu Mới"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              (click)="showCreateDialog()"
            ></button>
          </ng-template>
          <ng-template pTemplate="right">
            <span class="text-sm text-gray-600">
              Tổng số: {{ colors.length }} màu
            </span>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="colors"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} màu"
          [globalFilterFields]="['ColorName']"
          responsiveLayout="scroll"
          styleClass="p-datatable-gridlines"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Danh Sách Màu Sắc</h3>
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  placeholder="Tìm kiếm màu..."
                  (input)="applyGlobalFilter($event)"
                  class="text-sm"
                />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="ColorID" class="text-center">
                ID <p-sortIcon field="ColorID"></p-sortIcon>
              </th>
              <th pSortableColumn="ColorName">
                Tên Màu <p-sortIcon field="ColorName"></p-sortIcon>
              </th>
              <th class="text-center">Màu Hiển Thị</th>
              <th pSortableColumn="IsActive" class="text-center">
                Trạng Thái <p-sortIcon field="IsActive"></p-sortIcon>
              </th>
              <th pSortableColumn="CreatedAt" class="text-center">
                Ngày Tạo <p-sortIcon field="CreatedAt"></p-sortIcon>
              </th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-color>
            <tr>
              <td class="text-center">{{ color.ColorID }}</td>
              <td>
                <span class="font-medium">{{ color.ColorName }}</span>
              </td>
              <td class="text-center">
                <div class="flex justify-center">
                  <div
                    class="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                    [style.background-color]="getColorHex(color.ColorName)"
                    [title]="color.ColorName"
                  ></div>
                </div>
              </td>
              <td class="text-center">
                <p-tag
                  [value]="color.IsActive ? 'Hoạt động' : 'Ngừng hoạt động'"
                  [severity]="color.IsActive ? 'success' : 'danger'"
                ></p-tag>
              </td>
              <td class="text-center">
                {{ color.CreatedAt | date : 'dd/MM/yyyy' }}
              </td>
              <td class="text-center">
                <button
                  pButton
                  type="button"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-warning mr-1"
                  (click)="showEditDialog(color)"
                  [title]="'Sửa ' + color.ColorName"
                ></button>
                <button
                  pButton
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="confirmDelete(color)"
                  [title]="'Xóa ' + color.ColorName"
                ></button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="flex flex-col items-center">
                  <i class="pi pi-palette text-4xl text-gray-400 mb-3"></i>
                  <span class="text-gray-500"
                    >Không có màu nào được tìm thấy</span
                  >
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Create/Edit Dialog -->
      <p-dialog
        [(visible)]="displayDialog"
        [header]="isEditMode ? 'Cập Nhật Màu' : 'Thêm Màu Mới'"
        [modal]="true"
        [style]="{ width: '450px' }"
        [closable]="true"
        [closeOnEscape]="true"
      >
        <form
          [formGroup]="colorForm"
          (ngSubmit)="saveColor()"
          class="space-y-6"
        >
          <div class="field">
            <label
              for="colorName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên Màu <span class="text-red-500">*</span>
            </label>
            <input
              id="colorName"
              type="text"
              pInputText
              formControlName="ColorName"
              placeholder="Nhập tên màu (VD: Đỏ, Xanh dương...)"
              class="w-full"
              [class.ng-invalid]="
                colorForm.get('ColorName')?.invalid &&
                colorForm.get('ColorName')?.touched
              "
            />
            <small
              class="p-error block mt-1"
              *ngIf="
                colorForm.get('ColorName')?.invalid &&
                colorForm.get('ColorName')?.touched
              "
            >
              <span *ngIf="colorForm.get('ColorName')?.errors?.['required']">
                Tên màu là bắt buộc
              </span>
              <span *ngIf="colorForm.get('ColorName')?.errors?.['minlength']">
                Tên màu phải có ít nhất 2 ký tự
              </span>
              <span *ngIf="colorForm.get('ColorName')?.errors?.['maxlength']">
                Tên màu không được quá 50 ký tự
              </span>
            </small>
          </div>

          <!-- Color Preview -->
          <div class="field">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Xem Trước Màu
            </label>
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                [style.background-color]="
                  getColorHex(colorForm.get('ColorName')?.value || '')
                "
              ></div>
              <div class="text-sm text-gray-600">
                <div>
                  <strong>Tên:</strong>
                  {{ colorForm.get('ColorName')?.value || 'Chưa có' }}
                </div>
                <div>
                  <strong>Mã màu:</strong>
                  {{ getColorHex(colorForm.get('ColorName')?.value || '') }}
                </div>
              </div>
            </div>
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
              (click)="saveColor()"
              [disabled]="colorForm.invalid"
            ></button>
          </div>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [
    `
      .color-preview {
        transition: all 0.3s ease;
      }

      .color-preview:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.75rem;
      }

      .field {
        margin-bottom: 1rem;
      }

      .p-dialog .p-dialog-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .p-button.p-button-success {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border: none;
      }

      .color-circle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #e5e7eb;
        display: inline-block;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class ColorManagementComponent implements OnInit {
  colors: Color[] = [];
  loading = false;
  submitting = false;
  displayDialog = false;
  isEditMode = false;
  selectedColor: Color | null = null;
  colorForm: FormGroup;

  // Vietnamese color name to hex mapping
  private colorMap: { [key: string]: string } = {
    đỏ: '#dc2626',
    'xanh dương': '#2563eb',
    đen: '#1f2937',
    trắng: '#f9fafb',
    xám: '#6b7280',
    vàng: '#eab308',
    'xanh lá': '#16a34a',
    hồng: '#ec4899',
    tím: '#9333ea',
    cam: '#ea580c',
    nâu: '#a16207',
    'xanh mint': '#06b6d4',
    'xanh navy': '#1e3a8a',
    'đỏ đậm': '#991b1b',
    'xanh olive': '#65a30d',
    bạc: '#9ca3af',
    'vàng kim': '#d97706',
    'xanh pastel': '#7dd3fc',
    'hồng pastel': '#f9a8d4',
    'tím lavender': '#c084fc',
  };

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.colorForm = this.formBuilder.group({
      ColorName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      IsActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.loading = true;
    this.colorService.getColors().subscribe({
      next: (colors) => {
        this.colors = colors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading colors:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách màu',
        });
        this.loading = false;
      },
    });
  }

  showCreateDialog(): void {
    this.isEditMode = false;
    this.selectedColor = null;
    this.colorForm.reset({ IsActive: true });
    this.displayDialog = true;
  }

  showEditDialog(color: Color): void {
    this.isEditMode = true;
    this.selectedColor = color;
    this.colorForm.patchValue({
      ColorName: color.ColorName,
      IsActive: color.IsActive,
    });
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.colorForm.reset();
    this.selectedColor = null;
  }

  saveColor(): void {
    if (this.colorForm.invalid) {
      Object.keys(this.colorForm.controls).forEach((key) => {
        this.colorForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.selectedColor) {
      const updateRequest: UpdateColorRequest = {
        ColorID: this.selectedColor.ColorID,
        ColorName: this.colorForm.value.ColorName.trim(),
        IsActive: this.colorForm.value.IsActive,
      };

      this.colorService.updateColor(updateRequest).subscribe({
        next: (updatedColor) => {
          const index = this.colors.findIndex(
            (c) => c.ColorID === updatedColor.ColorID
          );
          if (index !== -1) {
            this.colors[index] = updatedColor;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật màu thành công',
          });
          this.hideDialog();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating color:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật màu',
          });
          this.submitting = false;
        },
      });
    } else {
      const createRequest: CreateColorRequest = {
        ColorName: this.colorForm.value.ColorName.trim(),
      };

      this.colorService.createColor(createRequest).subscribe({
        next: (newColor) => {
          this.colors.push(newColor);
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm màu mới thành công',
          });
          this.hideDialog();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creating color:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể thêm màu mới',
          });
          this.submitting = false;
        },
      });
    }
  }

  confirmDelete(color: Color): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa màu "${color.ColorName}"?`,
      header: 'Xác Nhận Xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        this.deleteColor(color.ColorID);
      },
    });
  }

  deleteColor(colorId: number): void {
    this.colorService.deleteColor(colorId).subscribe({
      next: () => {
        this.colors = this.colors.filter((c) => c.ColorID !== colorId);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Xóa màu thành công',
        });
      },
      error: (error) => {
        console.error('Error deleting color:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa màu',
        });
      },
    });
  }

  applyGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Note: In a real implementation, you would apply this filter to the table
    // For now, we'll implement a simple local filter
    const filterValue = target.value.toLowerCase();
    // This would typically be handled by PrimeNG table's global filter
  }

  getColorHex(colorName: string): string {
    if (!colorName) return '#f3f4f6';

    const normalizedName = colorName.toLowerCase().trim();
    return this.colorMap[normalizedName] || '#6b7280';
  }
}
