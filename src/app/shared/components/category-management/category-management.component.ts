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
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../../store/models/category.model';
import { CategoryService } from '../../../store/services/category.service';

@Component({
  selector: 'app-category-management',
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
            <h2 class="text-2xl font-bold text-gray-800">
              Quản Lý Danh Mục Sản Phẩm
            </h2>
          </div>
        </ng-template>

        <p-toolbar class="mb-4">
          <ng-template pTemplate="left">
            <p-button
              label="Thêm Danh Mục"
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
              (onClick)="loadCategories()"
            >
            </p-button>
          </ng-template>
        </p-toolbar>

        <p-table
          [value]="categories"
          [paginator]="true"
          [rows]="10"
          [loading]="loading"
          responsiveLayout="scroll"
          [globalFilterFields]="['CategoryName']"
          #dt
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">Danh sách danh mục</span>
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  (input)="
                    dt.filterGlobal($any($event.target).value, 'contains')
                  "
                  placeholder="Tìm kiếm danh mục..."
                />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th style="width: 80px">ID</th>
              <th>Tên Danh Mục</th>
              <th style="width: 120px">Trạng Thái</th>
              <th style="width: 180px">Ngày Tạo</th>
              <th style="width: 120px">Thao Tác</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-category>
            <tr>
              <td>{{ category.CategoryID }}</td>
              <td>{{ category.CategoryName }}</td>
              <td>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  [class]="
                    category.IsActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ category.IsActive ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </td>
              <td>{{ category.CreatedAt | date : 'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    (onClick)="editCategory(category)"
                    pTooltip="Chỉnh sửa"
                  >
                  </p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    (onClick)="deleteCategory(category)"
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
                <p class="text-gray-500">Không có danh mục nào</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Add/Edit Dialog -->
      <p-dialog
        [header]="isEditing ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'"
        [(visible)]="categoryDialog"
        [style]="{ width: '450px' }"
        [modal]="true"
        styleClass="p-fluid"
      >
        <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
          <div class="field">
            <label
              for="categoryName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên Danh Mục <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              pInputText
              formControlName="categoryName"
              placeholder="Nhập tên danh mục"
              autofocus
              [class.ng-invalid]="
                categoryForm.get('categoryName')?.invalid &&
                categoryForm.get('categoryName')?.touched
              "
            />

            <small
              class="text-red-500"
              *ngIf="
                categoryForm.get('categoryName')?.invalid &&
                categoryForm.get('categoryName')?.touched
              "
            >
              Tên danh mục là bắt buộc
            </small>
          </div>

          <div class="field" *ngIf="isEditing">
            <label class="flex items-center">
              <input type="checkbox" formControlName="isActive" class="mr-2" />
              <span class="text-sm font-medium text-gray-700"
                >Kích hoạt danh mục</span
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
              (onClick)="saveCategory()"
              [disabled]="categoryForm.invalid"
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
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryDialog = false;
  categoryForm!: FormGroup;
  isEditing = false;
  selectedCategory: Category | null = null;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true],
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách danh mục',
        });
        this.loading = false;
      },
    });
  }

  openNew(): void {
    this.selectedCategory = null;
    this.isEditing = false;
    this.categoryForm.reset();
    this.categoryForm.patchValue({ isActive: true });
    this.categoryDialog = true;
  }

  editCategory(category: Category): void {
    this.selectedCategory = { ...category };
    this.isEditing = true;
    this.categoryForm.patchValue({
      categoryName: category.CategoryName,
      isActive: category.IsActive,
    });
    this.categoryDialog = true;
  }

  hideDialog(): void {
    this.categoryDialog = false;
    this.categoryForm.reset();
    this.selectedCategory = null;
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      this.saving = true;
      const formValue = this.categoryForm.value;

      if (this.isEditing && this.selectedCategory) {
        const updateRequest: UpdateCategoryRequest = {
          CategoryID: this.selectedCategory.CategoryID,
          CategoryName: formValue.categoryName,
          IsActive: formValue.isActive,
        };

        this.categoryService.updateCategory(updateRequest).subscribe({
          next: (updatedCategory) => {
            const index = this.categories.findIndex(
              (c) => c.CategoryID === updatedCategory.CategoryID
            );
            if (index !== -1) {
              this.categories[index] = updatedCategory;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Danh mục đã được cập nhật',
            });

            this.hideDialog();
            this.saving = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật danh mục',
            });
            this.saving = false;
          },
        });
      } else {
        const createRequest: CreateCategoryRequest = {
          CategoryName: formValue.categoryName,
        };

        this.categoryService.createCategory(createRequest).subscribe({
          next: (newCategory) => {
            this.categories.push(newCategory);

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Danh mục mới đã được thêm',
            });

            this.hideDialog();
            this.saving = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể thêm danh mục mới',
            });
            this.saving = false;
          },
        });
      }
    }
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa danh mục "${category.CategoryName}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        this.categoryService.deleteCategory(category.CategoryID).subscribe({
          next: () => {
            this.categories = this.categories.filter(
              (c) => c.CategoryID !== category.CategoryID
            );

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Danh mục đã được xóa',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa danh mục',
            });
          },
        });
      },
    });
  }
}
