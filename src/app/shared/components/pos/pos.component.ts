import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppState } from '../../../store/app.state';
import { Customer } from '../../../store/customer/model/customer.model';
import { CartItem, PaymentMethod } from '../../../store/pos/model/pos.model';
import { Product } from '../../../store/product/model/product.model';
import * as POSActions from '../../../store/pos/pos.actions';
import * as CustomerActions from '../../../store/customer/customer.actions';
import * as ProductActions from '../../../store/product/product.actions';
import * as POSSelectors from '../../../store/pos/pos.selectors';
import * as CustomerSelectors from '../../../store/customer/customer.selectors';
import * as ProductSelectors from '../../../store/product/product.selectors';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    DialogModule,
    DropdownModule,
    BadgeModule,
    DividerModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="pos-container">
      <p-toast></p-toast>

      <div class="grid">
        <!-- Left Panel: Product Search & Cart -->
        <div class="col-12 lg:col-8">
          <!-- Product Search -->
          <p-card header="Product Search" class="mb-3">
            <div class="grid">
              <div class="col-12 md:col-6">
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-search"></i>
                  <input
                    type="text"
                    pInputText
                    placeholder="Search products by name or barcode..."
                    [(ngModel)]="productSearchTerm"
                    (input)="onProductSearch()"
                    class="w-full"
                  />
                </span>
              </div>
              <div class="col-12 md:col-6">
                <p-button
                  label="Scan Barcode"
                  icon="pi pi-qrcode"
                  severity="secondary"
                  class="w-full"
                >
                </p-button>
              </div>
            </div>

            <!-- Product Results -->
            <div class="mt-3" *ngIf="searchResults.length > 0">
              <h6>Search Results:</h6>
              <div class="grid">
                <div
                  class="col-12 sm:col-6 lg:col-4"
                  *ngFor="let product of searchResults"
                >
                  <div
                    class="product-card p-3 border-1 border-200 border-round mb-2 cursor-pointer hover:bg-gray-50"
                    (click)="addProductToCart(product)"
                  >
                    <div class="flex align-items-center">
                      <img
                        [src]="product.images[0] || '/assets/placeholder.svg'"
                        [alt]="product.name"
                        class="w-3rem h-3rem border-round mr-3"
                        (error)="onImageError($event)"
                      />
                      <div class="flex-1">
                        <div class="font-medium">{{ product.name }}</div>
                        <div class="text-sm text-500">
                          Stock: {{ product.stock }}
                        </div>
                        <div class="text-lg font-bold text-primary">
                          {{
                            product.price
                              | currency : 'VND' : 'symbol' : '1.0-0'
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-card>

          <!-- Shopping Cart -->
          <p-card header="Shopping Cart" class="mb-3">
            <p-table [value]="(cart$ | async) || []" [responsive]="true">
              <ng-template pTemplate="header">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </ng-template>

              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <div class="flex align-items-center">
                      <img
                        [src]="item.productImage"
                        [alt]="item.productName"
                        class="w-2rem h-2rem border-round mr-2"
                        (error)="onImageError($event)"
                      />
                      <span>{{ item.productName }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.price | currency : 'VND' : 'symbol' : '1.0-0' }}
                  </td>
                  <td>
                    <p-inputNumber
                      [(ngModel)]="item.quantity"
                      [showButtons]="true"
                      [min]="1"
                      [max]="99"
                      buttonLayout="horizontal"
                      spinnerMode="horizontal"
                      [step]="1"
                      decrementButtonClass="p-button-secondary"
                      incrementButtonClass="p-button-secondary"
                      (onInput)="updateQuantity(item.productId, item.quantity)"
                    >
                    </p-inputNumber>
                  </td>
                  <td>
                    {{
                      item.totalPrice | currency : 'VND' : 'symbol' : '1.0-0'
                    }}
                  </td>
                  <td>
                    <p-button
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      [text]="true"
                      (onClick)="removeFromCart(item.productId)"
                    >
                    </p-button>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="5" class="text-center">Cart is empty</td>
                </tr>
              </ng-template>
            </p-table>

            <div class="flex justify-content-end mt-3">
              <p-button
                label="Clear Cart"
                icon="pi pi-trash"
                severity="danger"
                [outlined]="true"
                (onClick)="clearCart()"
                [disabled]="(cart$ | async)?.length === 0"
              >
              </p-button>
            </div>
          </p-card>
        </div>

        <!-- Right Panel: Customer & Payment -->
        <div class="col-12 lg:col-4">
          <!-- Customer Selection -->
          <p-card header="Customer" class="mb-3">
            <div class="flex flex-column gap-3">
              <div>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-search"></i>
                  <input
                    type="text"
                    pInputText
                    placeholder="Search customer by name or phone..."
                    [(ngModel)]="customerSearchTerm"
                    (input)="onCustomerSearch()"
                    class="w-full"
                  />
                </span>
              </div>

              <div
                *ngIf="customerSearchResults.length > 0"
                class="customer-results"
              >
                <div class="text-sm font-medium mb-2">Select Customer:</div>
                <div
                  *ngFor="let customer of customerSearchResults"
                  class="customer-item p-2 border-1 border-200 border-round mb-1 cursor-pointer hover:bg-gray-50"
                  (click)="selectCustomer(customer)"
                >
                  <div class="font-medium">{{ customer.name }}</div>
                  <div class="text-sm text-500">{{ customer.phone }}</div>
                  <div class="text-sm">
                    <p-badge
                      [value]="customer.membershipLevel"
                      [severity]="
                        getMembershipBadgeSeverity(customer.membershipLevel)
                      "
                    >
                    </p-badge>
                    <span class="ml-2"
                      >{{ customer.loyaltyPoints }} points</span
                    >
                  </div>
                </div>
              </div>

              <div
                *ngIf="selectedCustomer$ | async as customer"
                class="selected-customer"
              >
                <div class="border-1 border-200 border-round p-3 bg-gray-50">
                  <div
                    class="flex justify-content-between align-items-start mb-2"
                  >
                    <div>
                      <div class="font-bold">{{ customer.name }}</div>
                      <div class="text-sm text-500">{{ customer.phone }}</div>
                    </div>
                    <p-button
                      icon="pi pi-times"
                      size="small"
                      [text]="true"
                      (onClick)="clearCustomer()"
                    >
                    </p-button>
                  </div>
                  <div class="flex justify-content-between text-sm">
                    <span>Membership:</span>
                    <p-badge
                      [value]="customer.membershipLevel"
                      [severity]="
                        getMembershipBadgeSeverity(customer.membershipLevel)
                      "
                    >
                    </p-badge>
                  </div>
                  <div class="flex justify-content-between text-sm mt-1">
                    <span>Available Points:</span>
                    <span class="font-medium">{{
                      customer.loyaltyPoints
                    }}</span>
                  </div>
                </div>
              </div>

              <p-button
                label="Add New Customer"
                icon="pi pi-plus"
                severity="secondary"
                [outlined]="true"
                class="w-full"
                (onClick)="showAddCustomerDialog = true"
              >
              </p-button>
            </div>
          </p-card>

          <!-- Loyalty Points -->
          <p-card
            header="Loyalty Points"
            class="mb-3"
            *ngIf="selectedCustomer$ | async as customer"
          >
            <div class="flex flex-column gap-3">
              <div>
                <label class="block text-sm font-medium mb-1"
                  >Use Points (Available: {{ customer.loyaltyPoints }})</label
                >
                <p-inputNumber
                  [(ngModel)]="loyaltyPointsToUse"
                  [min]="0"
                  [max]="customer.loyaltyPoints"
                  [showButtons]="true"
                  buttonLayout="horizontal"
                  class="w-full"
                  (onInput)="onLoyaltyPointsChange()"
                >
                </p-inputNumber>
              </div>
              <div class="text-sm text-500">
                Discount: {{ discountPercentage$ | async | number : '1.1-1' }}%
              </div>
            </div>
          </p-card>

          <!-- Order Summary -->
          <p-card header="Order Summary">
            <div class="flex flex-column gap-2">
              <div class="flex justify-content-between">
                <span>Subtotal:</span>
                <span>{{
                  subtotal$ | async | currency : 'VND' : 'symbol' : '1.0-0'
                }}</span>
              </div>
              <div
                class="flex justify-content-between text-green-600"
                *ngIf="(discountPercentage$ | async)! > 0"
              >
                <span
                  >Discount ({{
                    discountPercentage$ | async | number : '1.1-1'
                  }}%):</span
                >
                <span
                  >-{{
                    getDiscountAmount() | currency : 'VND' : 'symbol' : '1.0-0'
                  }}</span
                >
              </div>
              <p-divider></p-divider>
              <div class="flex justify-content-between font-bold text-lg">
                <span>Total:</span>
                <span>{{
                  total$ | async | currency : 'VND' : 'symbol' : '1.0-0'
                }}</span>
              </div>

              <div class="mt-4">
                <p-button
                  label="Process Payment"
                  icon="pi pi-credit-card"
                  class="w-full"
                  [disabled]="(cart$ | async)?.length === 0"
                  (onClick)="showPaymentDialog = true"
                >
                </p-button>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Payment Dialog -->
      <p-dialog
        header="Process Payment"
        [(visible)]="showPaymentDialog"
        [modal]="true"
        [style]="{ width: '500px' }"
        [draggable]="false"
        [resizable]="false"
      >
        <div class="flex flex-column gap-4">
          <!-- Order Summary -->
          <div class="border-1 border-200 border-round p-3 bg-gray-50">
            <div class="flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>{{
                subtotal$ | async | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div
              class="flex justify-content-between mb-2"
              *ngIf="(discountPercentage$ | async)! > 0"
            >
              <span>Discount:</span>
              <span class="text-green-600"
                >-{{
                  getDiscountAmount() | currency : 'VND' : 'symbol' : '1.0-0'
                }}</span
              >
            </div>
            <p-divider class="my-2"></p-divider>
            <div class="flex justify-content-between font-bold text-lg">
              <span>Total:</span>
              <span>{{
                total$ | async | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium mb-2">Payment Method</label>
            <p-dropdown
              [options]="paymentMethods"
              [(ngModel)]="selectedPaymentMethod"
              optionLabel="label"
              optionValue="value"
              placeholder="Select payment method"
              class="w-full"
            >
            </p-dropdown>
          </div>

          <!-- Cash Payment -->
          <div *ngIf="selectedPaymentMethod === 'cash'">
            <label class="block text-sm font-medium mb-1">Cash Received</label>
            <p-inputNumber
              [(ngModel)]="cashReceived"
              [min]="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              class="w-full"
            >
            </p-inputNumber>
            <div class="text-sm mt-1" *ngIf="getChange() >= 0">
              Change: {{ getChange() | currency : 'VND' : 'symbol' : '1.0-0' }}
            </div>
            <div class="text-sm mt-1 text-red-500" *ngIf="getChange() < 0">
              Insufficient cash
            </div>
          </div>

          <div class="flex justify-content-end gap-2">
            <p-button
              label="Cancel"
              severity="secondary"
              (onClick)="showPaymentDialog = false"
            >
            </p-button>
            <p-button
              label="Complete Payment"
              [disabled]="!canCompletePayment()"
              (onClick)="completePayment()"
            >
            </p-button>
          </div>
        </div>
      </p-dialog>

      <!-- Add Customer Dialog (simplified) -->
      <p-dialog
        header="Add New Customer"
        [(visible)]="showAddCustomerDialog"
        [modal]="true"
        [style]="{ width: '400px' }"
      >
        <form (ngSubmit)="addNewCustomer()" #customerForm="ngForm">
          <div class="flex flex-column gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                pInputText
                [(ngModel)]="newCustomer.name"
                name="name"
                required
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="text"
                pInputText
                [(ngModel)]="newCustomer.phone"
                name="phone"
                required
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                pInputText
                [(ngModel)]="newCustomer.email"
                name="email"
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
            ></p-button>
            <p-button
              label="Add Customer"
              type="submit"
              [disabled]="!customerForm.valid"
            ></p-button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .pos-container {
        padding: 1rem;
        height: 100vh;
        overflow-y: auto;
      }

      .product-card:hover {
        background-color: #f8f9fa;
      }

      .customer-item:hover {
        background-color: #f8f9fa;
      }

      .selected-customer {
        border: 1px solid #e9ecef;
        border-radius: 0.375rem;
        background-color: #f8f9fa;
      }

      :host ::ng-deep .p-inputnumber {
        width: 100%;
      }

      :host ::ng-deep .p-inputnumber-input {
        text-align: center;
      }
    `,
  ],
})
export class POSComponent implements OnInit {
  // Observables
  cart$!: Observable<CartItem[]>;
  selectedCustomer$!: Observable<Customer | null>;
  subtotal$!: Observable<number>;
  total$!: Observable<number>;
  discountPercentage$!: Observable<number>;
  loading$!: Observable<boolean>;

  // Search
  productSearchTerm = '';
  customerSearchTerm = '';
  searchResults: Product[] = [];
  customerSearchResults: Customer[] = [];

  // Payment
  showPaymentDialog = false;
  showAddCustomerDialog = false;
  selectedPaymentMethod = '';
  cashReceived = 0;
  loyaltyPointsToUse = 0;

  paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit Card', value: 'card' },
    { label: 'Digital Wallet', value: 'digital' },
  ];

  // New customer form
  newCustomer = {
    name: '',
    phone: '',
    email: '',
  };

  constructor(
    private store: Store<AppState>,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load initial data
    this.store.dispatch(ProductActions.loadProducts());
    this.store.dispatch(CustomerActions.loadCustomers());

    // Initialize observables
    this.cart$ = this.store.select((state) => state.pos.cart);
    this.selectedCustomer$ = this.store.select(
      (state) => state.pos.selectedCustomer
    );
    this.subtotal$ = this.store.select((state) => state.pos.subtotal);
    this.total$ = this.store.select((state) => state.pos.total);
    this.discountPercentage$ = this.store.select(
      (state) => state.pos.discountPercentage
    );
    this.loading$ = this.store.select((state) => state.pos.loading);
  }
  onProductSearch() {
    if (this.productSearchTerm.length >= 2) {
      // In a real app, this would be a selector or API call
      this.store
        .select((state) => state.products.filteredProducts)
        .subscribe((products) => {
          this.searchResults = products
            .filter(
              (product) =>
                product.name
                  .toLowerCase()
                  .includes(this.productSearchTerm.toLowerCase()) ||
                product.code.includes(this.productSearchTerm)
            )
            .slice(0, 6);
        });
    } else {
      this.searchResults = [];
    }
  }

  onCustomerSearch() {
    if (this.customerSearchTerm.length >= 2) {
      this.store
        .select((state) => state.customers.customers)
        .subscribe((customers) => {
          this.customerSearchResults = customers
            .filter(
              (customer) =>
                customer.name
                  .toLowerCase()
                  .includes(this.customerSearchTerm.toLowerCase()) ||
                customer.phone.includes(this.customerSearchTerm)
            )
            .slice(0, 5);
        });
    } else {
      this.customerSearchResults = [];
    }
  }
  addProductToCart(product: Product) {
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '/assets/placeholder.svg',
      price: product.price,
      quantity: 1,
      totalPrice: product.price,
    };

    this.store.dispatch(POSActions.addToCart({ item: cartItem }));
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} added to cart`,
    });
  }

  updateQuantity(productId: string, quantity: number) {
    this.store.dispatch(
      POSActions.updateCartItemQuantity({ productId, quantity })
    );
  }

  removeFromCart(productId: string) {
    this.store.dispatch(POSActions.removeFromCart({ productId }));
  }

  clearCart() {
    this.store.dispatch(POSActions.clearCart());
  }

  selectCustomer(customer: Customer) {
    this.store.dispatch(POSActions.selectCustomer({ customer }));
    this.customerSearchResults = [];
    this.customerSearchTerm = '';
  }

  clearCustomer() {
    this.store.dispatch(POSActions.selectCustomer({ customer: null }));
    this.loyaltyPointsToUse = 0;
  }

  onLoyaltyPointsChange() {
    this.store.dispatch(
      POSActions.setLoyaltyPointsToUse({ points: this.loyaltyPointsToUse })
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

  getDiscountAmount(): number {
    let subtotal = 0;
    let discountPercentage = 0;

    this.subtotal$.subscribe((s) => (subtotal = s));
    this.discountPercentage$.subscribe((d) => (discountPercentage = d));

    return (subtotal * discountPercentage) / 100;
  }

  getChange(): number {
    let total = 0;
    this.total$.subscribe((t) => (total = t));
    return this.cashReceived - total;
  }

  canCompletePayment(): boolean {
    if (this.selectedPaymentMethod === 'cash') {
      return this.getChange() >= 0;
    }
    return this.selectedPaymentMethod !== '';
  }

  completePayment() {
    const paymentMethods: PaymentMethod[] = [
      {
        type: this.selectedPaymentMethod as 'cash' | 'card' | 'digital',
        amount: 0, // Will be calculated in the effect
      },
    ];

    this.store.dispatch(
      POSActions.processPayment({
        paymentMethods,
        cashierInfo: { id: 'CASHIER001', name: 'Current User' },
      })
    );

    this.showPaymentDialog = false;
    this.selectedPaymentMethod = '';
    this.cashReceived = 0;
    this.loyaltyPointsToUse = 0;
  }

  addNewCustomer() {
    if (this.newCustomer.name && this.newCustomer.phone) {
      const customer: Customer = {
        id: Date.now().toString(),
        name: this.newCustomer.name,
        phone: this.newCustomer.phone,
        email: this.newCustomer.email || undefined,
        loyaltyPoints: 0,
        totalPurchases: 0,
        membershipLevel: 'Bronze',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.store.dispatch(CustomerActions.addCustomer({ customer }));
      this.selectCustomer(customer);
      this.showAddCustomerDialog = false;
      this.resetNewCustomerForm();
    }
  }

  private resetNewCustomerForm() {
    this.newCustomer = { name: '', phone: '', email: '' };
  }
  onImageError(event: any) {
    event.target.src = '/assets/placeholder.svg';
  }
}
