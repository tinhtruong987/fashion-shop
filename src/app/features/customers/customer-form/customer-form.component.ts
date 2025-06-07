import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
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
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
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
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  customerId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.customerId;

    if (this.isEditMode) {
      this.loadCustomer();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    });
  }

  private loadCustomer(): void {
    // TODO: Load customer from service
    this.loading = true;
    // Mock data for now
    const mockCustomer: Customer = {
      customerID: this.customerId!,
      userID: 3,
      name: 'John Doe',
      address: '123 Main St',
      rewardPoints: 0,
      totalSpent: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.form.patchValue(mockCustomer);
    this.loading = false;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    // TODO: Implement save logic
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Customer ${
          this.isEditMode ? 'updated' : 'created'
        } successfully`,
      });
      this.router.navigate(['/admin/customers']);
    }, 1000);
  }
}
