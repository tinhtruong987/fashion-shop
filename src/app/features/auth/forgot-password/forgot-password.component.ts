import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-forgot-password',
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
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <p-toast></p-toast>
      <p-card styleClass="w-full max-w-md">
        <ng-template pTemplate="header">
          <div class="text-center py-4">
            <h2 class="text-2xl font-bold">Quên mật khẩu</h2>
          </div>
        </ng-template>

        <form
          [formGroup]="forgotPasswordForm"
          (ngSubmit)="onSubmit()"
          class="space-y-4"
        >
          <div class="field">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  forgotPasswordForm.get('email')?.invalid &&
                  forgotPasswordForm.get('email')?.touched
              }"
            />
            <small
              class="text-red-500"
              *ngIf="
                forgotPasswordForm.get('email')?.invalid &&
                forgotPasswordForm.get('email')?.touched
              "
            >
              Vui lòng nhập email hợp lệ
            </small>
          </div>

          <div class="flex justify-between items-center">
            <a
              routerLink="/auth/login"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Quay lại đăng nhập
            </a>
          </div>

          <p-button
            type="submit"
            label="Gửi yêu cầu"
            styleClass="w-full"
            [loading]="loading"
          ></p-button>
        </form>
      </p-card>
    </div>
  `,
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const { email } = this.forgotPasswordForm.value;

      // TODO: Replace with actual API call
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn',
        });
        this.loading = false;
      }, 1000);
    }
  }
}
