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
import { Color } from '../../../core/models/color.model';
import { MOCK_COLORS } from '../../../core/mock/colors.mock';

@Component({
  selector: 'app-color-form',
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
          {{ isEditMode ? 'Sửa màu sắc' : 'Thêm màu sắc mới' }}
        </h1>
      </div>

      <p-card>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div class="field">
            <label for="colorName" class="block mb-2">Tên màu sắc</label>
            <input
              id="colorName"
              type="text"
              pInputText
              formControlName="colorName"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty': isFieldInvalid('colorName')
              }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('colorName')">
              Tên màu sắc là bắt buộc
            </small>
          </div>

          <div class="flex justify-end gap-2">
            <p-button
              label="Hủy"
              styleClass="p-button-text"
              routerLink="/admin/colors"
            ></p-button>
            <p-button label="Lưu" type="submit" [loading]="loading"></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class ColorFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  colorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.colorId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.colorId;

    if (this.isEditMode) {
      // TODO: Replace with actual API call
      const color = MOCK_COLORS.find(
        (c) => c.colorID.toString() === this.colorId
      );
      if (color) {
        this.form.patchValue(color);
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      colorName: ['', Validators.required],
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
          ? 'Cập nhật màu sắc thành công'
          : 'Thêm màu sắc thành công',
      });
    }, 1000);
  }
}
