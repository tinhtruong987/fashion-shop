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
import { Size } from '../../../core/models/size.model';
import { MOCK_SIZES } from '../../../core/mock/sizes.mock';

@Component({
  selector: 'app-size-form',
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
          {{ isEditMode ? 'Sửa kích thước' : 'Thêm kích thước mới' }}
        </h1>
      </div>

      <p-card>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div class="field">
            <label for="sizeName" class="block mb-2">Tên kích thước</label>
            <input
              id="sizeName"
              type="text"
              pInputText
              formControlName="sizeName"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty': isFieldInvalid('sizeName')
              }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('sizeName')">
              Tên kích thước là bắt buộc
            </small>
          </div>

          <div class="flex justify-end gap-2">
            <p-button
              label="Hủy"
              styleClass="p-button-text"
              routerLink="/admin/sizes"
            ></p-button>
            <p-button label="Lưu" type="submit" [loading]="loading"></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class SizeFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  sizeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.sizeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.sizeId;

    if (this.isEditMode) {
      // TODO: Replace with actual API call
      const size = MOCK_SIZES.find((s) => s.sizeID.toString() === this.sizeId);
      if (size) {
        this.form.patchValue(size);
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      sizeName: ['', Validators.required],
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
          ? 'Cập nhật kích thước thành công'
          : 'Thêm kích thước thành công',
      });
    }, 1000);
  }
}
