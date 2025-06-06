import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';

import { AppState } from '../../../store/app.state';
import { Customer } from '../../../store/customer/model/customer.model';
import * as CustomerActions from '../../../store/customer/customer.actions';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    BadgeModule,
    DialogModule,
  ],
  template: `
    <div class="customer-list-container">
      <p-card header="Customer Management" styleClass="p-mb-4">
        <!-- Search and Filter Controls -->
        <div class="p-grid p-align-center p-mb-3">
          <div class="p-col-12 p-md-6">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                type="text"
                pInputText
                placeholder="Search customers..."
                [(ngModel)]="searchTerm"
                (input)="onSearch()"
                class="w-full"
              />
            </span>
          </div>
          <div class="p-col-12 p-md-3">
            <p-dropdown
              [options]="membershipLevels"
              [(ngModel)]="selectedMembershipLevel"
              placeholder="All Membership Levels"
              (onChange)="onFilter()"
              class="w-full"
            >
            </p-dropdown>
          </div>
          <div class="p-col-12 p-md-3">
            <p-button
              label="Add New Customer"
              icon="pi pi-plus"
              class="w-full"
              (onClick)="showAddCustomerDialog = true"
            >
            </p-button>
          </div>
        </div>
        <!-- Customer Table -->
        <p-table
          [value]="(filteredCustomers$ | async) || []"
          [loading]="loading$ | async"
          [responsive]="true"
          styleClass="p-datatable-customers"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Membership Level</th>
              <th>Loyalty Points</th>
              <th>Total Purchases</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-customer>
            <tr>
              <td>
                <div class="customer-name">
                  <strong>{{ customer.name }}</strong>
                  <div class="text-sm text-gray-500">ID: {{ customer.id }}</div>
                </div>
              </td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.email || 'N/A' }}</td>
              <td>
                <p-badge
                  [value]="customer.membershipLevel"
                  [severity]="
                    getMembershipBadgeSeverity(customer.membershipLevel)
                  "
                >
                </p-badge>
              </td>
              <td>{{ customer.loyaltyPoints | number }}</td>
              <td>
                {{
                  customer.totalPurchases
                    | currency : 'VND' : 'symbol' : '1.0-0'
                }}
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-eye"
                    size="small"
                    severity="info"
                    [text]="true"
                    pTooltip="View Details"
                    (onClick)="viewCustomer(customer)"
                  >
                  </p-button>
                  <p-button
                    icon="pi pi-pencil"
                    size="small"
                    severity="warn"
                    [text]="true"
                    pTooltip="Edit Customer"
                    (onClick)="editCustomer(customer)"
                  >
                  </p-button>
                  <p-button
                    icon="pi pi-shopping-cart"
                    size="small"
                    severity="success"
                    [text]="true"
                    pTooltip="Select for POS"
                    (onClick)="selectForPOS(customer)"
                  >
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">No customers found</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Add/Edit Customer Dialog -->
      <p-dialog
        header="Add New Customer"
        [(visible)]="showAddCustomerDialog"
        [modal]="true"
        [style]="{ width: '450px' }"
        [draggable]="false"
        [resizable]="false"
      >
        <form (ngSubmit)="onSubmitCustomer()" #customerForm="ngForm">
          <div class="flex flex-column gap-3">
            <div>
              <label for="customerName" class="block text-sm font-medium mb-1"
                >Customer Name *</label
              >
              <input
                id="customerName"
                type="text"
                pInputText
                [(ngModel)]="customerFormData.name"
                name="customerName"
                required
                class="w-full"
              />
            </div>

            <div>
              <label for="customerPhone" class="block text-sm font-medium mb-1"
                >Phone Number *</label
              >
              <input
                id="customerPhone"
                type="text"
                pInputText
                [(ngModel)]="customerFormData.phone"
                name="customerPhone"
                required
                class="w-full"
              />
            </div>

            <div>
              <label for="customerEmail" class="block text-sm font-medium mb-1"
                >Email</label
              >
              <input
                id="customerEmail"
                type="email"
                pInputText
                [(ngModel)]="customerFormData.email"
                name="customerEmail"
                class="w-full"
              />
            </div>

            <div>
              <label
                for="customerAddress"
                class="block text-sm font-medium mb-1"
                >Address</label
              >
              <input
                id="customerAddress"
                type="text"
                pInputText
                [(ngModel)]="customerFormData.address"
                name="customerAddress"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex justify-content-end gap-2 mt-4">
            <p-button
              label="Cancel"
              severity="secondary"
              (onClick)="showAddCustomerDialog = false"
              type="button"
            >
            </p-button>
            <p-button
              label="Save Customer"
              type="submit"
              [disabled]="!customerForm.valid"
            >
            </p-button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .customer-list-container {
        padding: 1rem;
      }

      .customer-name {
        display: flex;
        flex-direction: column;
      }

      .text-sm {
        font-size: 0.875rem;
      }

      .text-gray-500 {
        color: #6b7280;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.75rem;
      }

      :host ::ng-deep .p-card .p-card-body {
        padding: 1.5rem;
      }
    `,
  ],
})
export class CustomerListComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  filteredCustomers$!: Observable<Customer[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  searchTerm = '';
  selectedMembershipLevel = '';
  showAddCustomerDialog = false;

  membershipLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Bronze', value: 'Bronze' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Platinum', value: 'Platinum' },
  ];

  customerFormData = {
    name: '',
    phone: '',
    email: '',
    address: '',
  };

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Load customers on component init
    this.store.dispatch(CustomerActions.loadCustomers());

    // Subscribe to store selectors
    this.customers$ = this.store.select((state) => state.customers.customers);
    this.filteredCustomers$ = this.store.select(
      (state) => state.customers.filteredCustomers
    );
    this.loading$ = this.store.select((state) => state.customers.loading);
    this.error$ = this.store.select((state) => state.customers.error);
  }

  onSearch() {
    this.store.dispatch(
      CustomerActions.searchCustomers({ searchTerm: this.searchTerm })
    );
  }

  onFilter() {
    this.store.dispatch(
      CustomerActions.filterCustomers({
        filter: {
          searchTerm: this.searchTerm,
          membershipLevel: this.selectedMembershipLevel || undefined,
        },
      })
    );
  }

  getMembershipBadgeSeverity(
    level: string
  ): 'success' | 'info' | 'warn' | 'danger' {
    switch (level) {
      case 'Platinum':
        return 'success';
      case 'Gold':
        return 'warn';
      case 'Silver':
        return 'info';
      default:
        return 'danger';
    }
  }

  viewCustomer(customer: Customer) {
    this.store.dispatch(CustomerActions.selectCustomerForPOS({ customer }));
    // Navigate to customer detail view if needed
  }

  editCustomer(customer: Customer) {
    // Implement edit functionality
    this.customerFormData = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
    };
    this.showAddCustomerDialog = true;
  }

  selectForPOS(customer: Customer) {
    this.store.dispatch(CustomerActions.selectCustomerForPOS({ customer }));
    // Navigate to POS page
    window.location.href = '/pos';
  }

  onSubmitCustomer() {
    if (this.customerFormData.name && this.customerFormData.phone) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: this.customerFormData.name,
        phone: this.customerFormData.phone,
        email: this.customerFormData.email || undefined,
        address: this.customerFormData.address || undefined,
        loyaltyPoints: 0,
        totalPurchases: 0,
        membershipLevel: 'Bronze',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.store.dispatch(
        CustomerActions.addCustomer({ customer: newCustomer })
      );
      this.showAddCustomerDialog = false;
      this.resetForm();
    }
  }

  private resetForm() {
    this.customerFormData = {
      name: '',
      phone: '',
      email: '',
      address: '',
    };
  }
}
