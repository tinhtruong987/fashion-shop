import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Category } from '../../../core/models/category.model';
import { MOCK_CATEGORIES } from '../../../core/mock/categories.mock';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>

      <div class="mb-4">
        <h1 class="text-2xl font-bold">
          {{ isEditMode ? 'Sửa danh mục' : 'Thêm danh mục mới' }}
        </h1>
      </div>

      <p-card>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div class="field">
            <label for="categoryName" class="block mb-2">Tên danh mục</label>
            <input
              id="categoryName"
              type="text"
              pInputText
              formControlName="categoryName"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty': isFieldInvalid('categoryName')
              }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('categoryName')">
              Tên danh mục là bắt buộc
            </small>
          </div>

          <div class="flex justify-end gap-2">
            <p-button
              label="Hủy"
              styleClass="p-button-text"
              routerLink="/admin/categories"
            ></p-button>
            <p-button label="Lưu" type="submit" [loading]="loading"></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode) {
      // TODO: Replace with actual API call
      const category = MOCK_CATEGORIES.find(
        (c) => c.categoryID === Number(this.categoryId)
      );
      if (category) {
        this.form.patchValue(category);
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      categoryName: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.form.get(field);
    return (
      !!formControl &&
      formControl.invalid &&
      (formControl.dirty || formControl.touched)
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;

    // TODO: Replace with actual API call
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: this.isEditMode
          ? 'Cập nhật danh mục thành công'
          : 'Thêm danh mục thành công',
      });
    }, 1000);
  }
}
