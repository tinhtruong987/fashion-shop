import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Customer } from '../../../models/customer.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    CheckboxModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  loading = true;
  displayDialog = false;
  customer: Customer = {
    customerID: 0,
    name: '',
    phone: '',
    email: '',
    address: '',
    loyaltyPoints: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      address: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    // TODO: Implement API call
    this.loading = false;
  }

  createCustomer(): void {
    this.customer = {
      customerID: 0,
      name: '',
      phone: '',
      email: '',
      address: '',
      loyaltyPoints: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customerForm.patchValue(this.customer);
    this.displayDialog = true;
  }

  editCustomer(customer: Customer): void {
    this.customer = { ...customer };
    this.customerForm.patchValue(this.customer);
    this.displayDialog = true;
  }

  deleteCustomer(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"?`,
      accept: () => {
        // TODO: Implement API call
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa khách hàng',
        });
      },
    });
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại thông tin',
      });
      return;
    }

    const formValue = this.customerForm.value;
    const customer: Customer = {
      ...this.customer,
      ...formValue,
      updatedAt: new Date(),
    };

    if (customer.customerID === 0) {
      // Create new customer
      customer.createdAt = new Date();
      // TODO: Implement API call
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thêm khách hàng mới',
      });
    } else {
      // Update existing customer
      // TODO: Implement API call
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã cập nhật thông tin khách hàng',
      });
    }

    this.displayDialog = false;
    this.loadCustomers();
  }

  viewCustomerHistory(customer: Customer): void {
    // TODO: Implement view customer order history
  }
}
