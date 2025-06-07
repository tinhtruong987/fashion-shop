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
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MOCK_USERS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
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
            <h2 class="text-2xl font-bold">Đăng nhập</h2>
          </div>
        </ng-template>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="field">
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Tên đăng nhập</label
            >
            <input
              id="username"
              type="text"
              pInputText
              formControlName="username"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  loginForm.get('username')?.invalid &&
                  loginForm.get('username')?.touched
              }"
            />
            <small
              class="text-red-500"
              *ngIf="
                loginForm.get('username')?.invalid &&
                loginForm.get('username')?.touched
              "
            >
              Vui lòng nhập tên đăng nhập
            </small>
          </div>

          <div class="field">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Mật khẩu</label
            >
            <p-password
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched
              }"
            ></p-password>
            <small
              class="text-red-500"
              *ngIf="
                loginForm.get('password')?.invalid &&
                loginForm.get('password')?.touched
              "
            >
              Vui lòng nhập mật khẩu
            </small>
          </div>

          <div class="flex justify-between items-center">
            <a
              routerLink="/auth/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Quên mật khẩu?
            </a>
          </div>

          <p-button
            type="submit"
            label="Đăng nhập"
            styleClass="w-full"
            [loading]="loading"
          ></p-button>
        </form>
      </p-card>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      // TODO: Replace with actual API call
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // TODO: Store user info in service/localStorage
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đăng nhập thành công',
        });
        // TODO: Navigate based on user role
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Tên đăng nhập hoặc mật khẩu không đúng',
        });
      }
      this.loading = false;
    }
  }
}
