import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Category } from '../../../core/models/category.model';
import { MOCK_CATEGORIES } from '../../../core/mock/categories.mock';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">
          {{ isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới' }}
        </h1>
        <p-button
          label="Quay lại"
          icon="pi pi-arrow-left"
          styleClass="p-button-text"
          routerLink="/admin/products"
        ></p-button>
      </div>

      <p-card>
        <form
          [formGroup]="productForm"
          (ngSubmit)="onSubmit()"
          class="space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Product Code -->
            <div class="field">
              <label
                for="productCode"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Mã sản phẩm</label
              >
              <input
                id="productCode"
                type="text"
                pInputText
                formControlName="productCode"
                class="w-full"
                [ngClass]="{
                  'ng-invalid ng-dirty': isFieldInvalid('productCode')
                }"
              />
              <small
                class="text-red-500"
                *ngIf="productForm.get('productCode')?.errors?.['required'] && productForm.get('productCode')?.touched"
              >
                Vui lòng nhập mã sản phẩm
              </small>
            </div>

            <!-- Product Name -->
            <div class="field">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Tên sản phẩm</label
              >
              <input
                id="name"
                type="text"
                pInputText
                formControlName="name"
                class="w-full"
                [ngClass]="{
                  'ng-invalid ng-dirty': isFieldInvalid('name')
                }"
              />
              <small
                class="text-red-500"
                *ngIf="productForm.get('name')?.errors?.['required'] && productForm.get('name')?.touched"
              >
                Vui lòng nhập tên sản phẩm
              </small>
            </div>

            <!-- Category -->
            <div class="field">
              <label
                for="categoryID"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Danh mục</label
              >
              <p-dropdown
                id="categoryID"
                [options]="categories"
                formControlName="categoryID"
                optionLabel="categoryName"
                optionValue="categoryID"
                placeholder="Chọn danh mục"
                class="w-full"
                [ngClass]="{
                  'ng-invalid ng-dirty': isFieldInvalid('categoryID')
                }"
              ></p-dropdown>
              <small
                class="text-red-500"
                *ngIf="productForm.get('categoryID')?.errors?.['required'] && productForm.get('categoryID')?.touched"
              >
                Vui lòng chọn danh mục
              </small>
            </div>

            <!-- Price -->
            <div class="field">
              <label
                for="price"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Giá</label
              >
              <p-inputNumber
                id="price"
                formControlName="price"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                class="w-full"
                [ngClass]="{
                  'ng-invalid ng-dirty': isFieldInvalid('price')
                }"
              ></p-inputNumber>
              <small
                class="text-red-500"
                *ngIf="productForm.get('price')?.errors?.['required'] && productForm.get('price')?.touched"
              >
                Vui lòng nhập giá
              </small>
            </div>

            <!-- Description -->
            <div class="field md:col-span-2">
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Mô tả</label
              >
              <textarea
                id="description"
                pInputTextarea
                formControlName="description"
                [rows]="3"
                class="w-full"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <p-button
              type="button"
              label="Hủy"
              styleClass="p-button-text"
              routerLink="/admin/products"
            ></p-button>
            <p-button
              type="submit"
              label="Lưu"
              icon="pi pi-save"
              [loading]="loading"
            ></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      categoryID: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  ngOnInit() {
    // TODO: Replace with actual API call
    this.categories = MOCK_CATEGORIES;

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode = true;
      // TODO: Load product data
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      // TODO: Implement save logic
      setTimeout(() => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: this.isEditMode
            ? 'Cập nhật sản phẩm thành công'
            : 'Thêm sản phẩm thành công',
        });
      }, 1000);
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
