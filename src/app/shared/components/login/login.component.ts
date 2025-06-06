import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { StaffService } from '../../../store/services/staff.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ToastModule,
    DialogModule,
  ],
  providers: [MessageService],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div class="w-full max-w-md">
        <p-card>
          <ng-template pTemplate="header">
            <div class="text-center py-8">
              <i class="pi pi-user text-6xl text-blue-600 mb-4"></i>
              <h2 class="text-2xl font-bold text-gray-800">
                Đăng Nhập Hệ Thống
              </h2>
              <p class="text-gray-600">Vui lòng nhập thông tin đăng nhập</p>
            </div>
          </ng-template>

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onLogin()"
            class="space-y-6"
          >
            <div class="field">
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                pInputText
                formControlName="username"
                placeholder="Nhập tên đăng nhập"
                class="w-full"
                [class.ng-invalid]="
                  loginForm.get('username')?.invalid &&
                  loginForm.get('username')?.touched
                "
              />

              <small
                class="text-red-500"
                *ngIf="
                  loginForm.get('username')?.invalid &&
                  loginForm.get('username')?.touched
                "
              >
                Tên đăng nhập là bắt buộc
              </small>
            </div>

            <div class="field">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <p-password
                formControlName="password"
                [toggleMask]="true"
                placeholder="Nhập mật khẩu"
                styleClass="w-full"
                inputStyleClass="w-full"
                [feedback]="false"
              >
              </p-password>

              <small
                class="text-red-500"
                *ngIf="
                  loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched
                "
              >
                Mật khẩu là bắt buộc
              </small>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                class="text-sm text-blue-600 hover:text-blue-800"
                (click)="showForgotPassword = true"
              >
                Quên mật khẩu?
              </button>
            </div>

            <p-button
              type="submit"
              label="Đăng Nhập"
              icon="pi pi-sign-in"
              [loading]="isLoading"
              [disabled]="loginForm.invalid"
              styleClass="w-full justify-center text-lg py-3"
            >
            </p-button>
          </form>

          <ng-template pTemplate="footer">
            <div class="text-center text-sm text-gray-600">
              <p>Chỉ dành cho nhân viên và quản trị viên</p>
            </div>
          </ng-template>
        </p-card>
      </div>

      <!-- Forgot Password Dialog -->
      <p-dialog
        header="Quên Mật Khẩu"
        [(visible)]="showForgotPassword"
        [style]="{ width: '400px' }"
        [modal]="true"
      >
        <form
          [formGroup]="forgotPasswordForm"
          (ngSubmit)="onForgotPassword()"
          class="space-y-4"
        >
          <p class="text-gray-600 mb-4">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>

          <div class="field">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              pInputText
              formControlName="email"
              placeholder="Nhập địa chỉ email"
              class="w-full"
            />

            <small
              class="text-red-500"
              *ngIf="
                forgotPasswordForm.get('email')?.invalid &&
                forgotPasswordForm.get('email')?.touched
              "
            >
              Email không hợp lệ
            </small>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <p-button
              label="Hủy"
              severity="secondary"
              (onClick)="showForgotPassword = false"
            >
            </p-button>
            <p-button
              type="submit"
              label="Gửi"
              [loading]="isSending"
              [disabled]="forgotPasswordForm.invalid"
            >
            </p-button>
          </div>
        </form>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .p-card {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
      }

      .field {
        margin-bottom: 1.5rem;
      }

      .p-inputtext:focus,
      .p-password input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
      }

      .ng-invalid.ng-touched {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  isSending = false;
  showForgotPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private staffService: StaffService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {}

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData = this.loginForm.value;

      // Mock authentication - in real app, call service
      setTimeout(() => {
        if (
          loginData.username === 'admin' &&
          loginData.password === 'admin123'
        ) {
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng nhập thành công',
            detail: 'Chào mừng bạn quay trở lại!',
          });

          // Store user session
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              username: loginData.username,
              role: 'Admin',
              loginTime: new Date(),
            })
          );

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        } else if (
          loginData.username === 'staff' &&
          loginData.password === 'staff123'
        ) {
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng nhập thành công',
            detail: 'Chào mừng nhân viên!',
          });

          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              username: loginData.username,
              role: 'Staff',
              loginTime: new Date(),
            })
          );

          setTimeout(() => {
            this.router.navigate(['/sales']);
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Đăng nhập thất bại',
            detail: 'Tên đăng nhập hoặc mật khẩu không đúng',
          });
        }

        this.isLoading = false;
      }, 1500);
    }
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      this.isSending = true;

      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Email đã được gửi',
          detail: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
        });

        this.showForgotPassword = false;
        this.forgotPasswordForm.reset();
        this.isSending = false;
      }, 2000);
    }
  }
}
