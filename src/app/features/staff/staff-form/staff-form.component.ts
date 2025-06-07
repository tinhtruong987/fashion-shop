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
import { Staff } from '../../../core/models/staff.model';

@Component({
  selector: 'app-staff-form',
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

      <p-card [header]="isEditMode ? 'Sửa nhân viên' : 'Thêm nhân viên mới'">
        <form
          [formGroup]="staffForm"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div class="field">
            <label for="name" class="block mb-2">Họ tên</label>
            <input
              id="name"
              type="text"
              pInputText
              formControlName="name"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('name') }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('name')">
              Họ tên là bắt buộc
            </small>
          </div>

          <div class="field">
            <label for="position" class="block mb-2">Vị trí</label>
            <input
              id="position"
              type="text"
              pInputText
              formControlName="position"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('position') }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('position')">
              Vị trí là bắt buộc
            </small>
          </div>

          <div class="field">
            <label for="username" class="block mb-2">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              pInputText
              formControlName="username"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('username') }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('username')">
              Tên đăng nhập là bắt buộc
            </small>
          </div>

          <div class="field">
            <label for="email" class="block mb-2">Email</label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('email') }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('email')">
              Email không hợp lệ
            </small>
          </div>

          <div class="field">
            <label for="password" class="block mb-2">
              {{
                isEditMode
                  ? 'Mật khẩu mới (để trống nếu không muốn thay đổi)'
                  : 'Mật khẩu'
              }}
            </label>
            <input
              id="password"
              type="password"
              pInputText
              formControlName="password"
              class="w-full"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('password') }"
            />
            <small class="text-red-500" *ngIf="isFieldInvalid('password')">
              Mật khẩu phải có ít nhất 6 ký tự
            </small>
          </div>

          <div class="flex justify-end gap-2">
            <p-button
              label="Hủy"
              styleClass="p-button-text"
              routerLink="/admin/staff"
            ></p-button>
            <p-button label="Lưu" type="submit" [loading]="loading"></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class StaffFormComponent implements OnInit {
  staffForm: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    const staffId = this.route.snapshot.paramMap.get('id');
    if (staffId) {
      this.isEditMode = true;
      // TODO: Replace with actual API call
      const staff: Staff = {
        staffID: 1,
        userAccountID: 1,
        name: 'John Doe',
        position: 'Nhân viên bán hàng',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userAccount: {
          userAccountID: 1,
          username: 'johndoe',
          passwordHash: 'hashed_password',
          email: 'john@example.com',
          role: 'Staff',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      this.staffForm.patchValue({
        name: staff.name,
        position: staff.position,
        username: staff.userAccount?.username,
        email: staff.userAccount?.email,
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.staffForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.staffForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại thông tin',
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
          ? 'Cập nhật nhân viên thành công'
          : 'Thêm nhân viên mới thành công',
      });
    }, 1000);
  }
}
