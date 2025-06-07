import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

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
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';

import { AppState } from '../../../store/app.state';
import { Customer } from '../../../store/customer/model/customer.model';
import {
  CartItem,
  PaymentMethod,
  Receipt,
} from '../../../store/pos/model/pos.model';
import { Product } from '../../../store/product/model/product.model';
import { ReceiptComponent } from '../receipt/receipt.component';
import * as POSActions from '../../../store/pos/pos.actions';
import * as CustomerActions from '../../../store/customer/customer.actions';
import * as ProductActions from '../../../store/product/product.actions';
import * as POSSelectors from '../../../store/pos/pos.selectors';
import * as CustomerSelectors from '../../../store/customer/customer.selectors';
import * as ProductSelectors from '../../../store/product/product.selectors';

interface CategoryFilter {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sales-pos',
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
    DataViewModule,
    TagModule,
    PanelModule,
    ScrollPanelModule,
    PaginatorModule,
    ReceiptComponent,
  ],
  providers: [MessageService],
  template: `
    <!-- All global components outside the main container to avoid z-index conflicts -->
    <p-toast position="top-right" [baseZIndex]="9999"></p-toast>

    <!-- Customer Dialog moved outside the main container -->
    <p-dialog
      header="Thêm khách hàng mới"
      [(visible)]="showCustomerDialog"
      [modal]="true"
      [style]="{ width: '350px' }"
      [baseZIndex]="9999"
      styleClass="pos-dialog"
    >
      <div class="customer-form">
        <div class="form-field">
          <label>Tên khách hàng *</label>
          <input
            type="text"
            pInputText
            [(ngModel)]="newCustomer.name"
            class="form-input"
          />
        </div>

        <div class="form-field">
          <label>Số điện thoại *</label>
          <input
            type="text"
            pInputText
            [(ngModel)]="newCustomer.phone"
            class="form-input"
          />
        </div>

        <div class="form-field">
          <label>Email</label>
          <input
            type="email"
            pInputText
            [(ngModel)]="newCustomer.email"
            class="form-input"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button class="btn-secondary" (click)="showCustomerDialog = false">
            Hủy
          </button>
          <button
            class="btn-primary"
            (click)="addNewCustomer()"
            [disabled]="!newCustomer.name || !newCustomer.phone"
          >
            Lưu
          </button>
        </div>
      </ng-template>
    </p-dialog>

    <!-- Payment Confirmation Dialog moved outside the main container -->
    <p-dialog
      header="Thanh toán thành công"
      [(visible)]="showPaymentDialog"
      [modal]="true"
      [style]="{ width: '400px' }"
      [baseZIndex]="9999"
      styleClass="pos-dialog"
    >
      <div class="payment-success">
        <div class="success-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <h4>Giao dịch hoàn tất!</h4>

        <div class="payment-details">
          <div class="detail-line">
            <span>Tổng tiền:</span>
            <span class="amount">{{
              lastPaymentAmount | currency : 'VND' : 'symbol' : '1.0-0'
            }}</span>
          </div>
          <div class="detail-line">
            <span>Phương thức:</span>
            <span>{{ getPaymentMethodLabel(lastPaymentMethod) }}</span>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button class="btn-secondary" (click)="printReceipt()">
            <i class="pi pi-print"></i> In hóa đơn
          </button>
          <button class="btn-primary" (click)="startNewTransaction()">
            <i class="pi pi-plus"></i> Giao dịch mới
          </button>
        </div>
      </ng-template>
    </p-dialog>

    <div class="pos-sales-container">
      <!-- More compact header -->
      <div class="header-bar">
        <div class="header-left">
          <i class="pi pi-shopping-cart header-icon"></i>
          <span class="header-title">POS</span>
        </div>
        <div class="header-actions">
          <p-button
            icon="pi pi-user-plus"
            size="small"
            severity="secondary"
            [text]="true"
            pTooltip="Khách hàng mới"
            (onClick)="showCustomerDialog = true"
          ></p-button>
          <p-button
            icon="pi pi-history"
            size="small"
            severity="info"
            [text]="true"
            pTooltip="Lịch sử"
          ></p-button>
        </div>
      </div>
      <div class="main-layout">
        <!-- Left Panel: Quick Search & Products -->
        <div class="products-panel">
          <!-- Compact Search Section -->
          <div class="search-section">
            <div class="search-row">
              <div class="search-input-group">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input
                    type="text"
                    pInputText
                    placeholder="Quét mã/Tìm sản phẩm..."
                    [(ngModel)]="productSearchTerm"
                    (input)="onSearchInput()"
                    (keyup.enter)="quickAddProduct()"
                    class="search-input-field"
                  />
                </span>
              </div>

              <div class="filter-controls">
                <p-dropdown
                  [options]="categories"
                  [(ngModel)]="selectedCategory"
                  placeholder="Danh mục"
                  [showClear]="true"
                  (onChange)="filterProducts()"
                  styleClass="category-dropdown"
                ></p-dropdown>

                <div class="view-toggle">
                  <p-button
                    icon="pi pi-th-large"
                    [text]="true"
                    size="small"
                    severity="secondary"
                    [class]="viewMode === 'grid' ? 'active' : ''"
                    (onClick)="setViewMode('grid')"
                    pTooltip="Lưới"
                  ></p-button>
                  <p-button
                    icon="pi pi-list"
                    [text]="true"
                    size="small"
                    severity="secondary"
                    [class]="viewMode === 'list' ? 'active' : ''"
                    (onClick)="setViewMode('list')"
                    pTooltip="Danh sách"
                  ></p-button>
                </div>
              </div>
            </div>

            <!-- Search Info -->
            <div
              class="search-info"
              *ngIf="productSearchTerm || selectedCategory"
            >
              <span class="results-count">
                {{ filteredProducts.length }} / {{ allProducts.length }} sản
                phẩm
              </span>
              <button class="clear-filters" (click)="clearFilters()">
                <i class="pi pi-times"></i>
                Xóa bộ lọc
              </button>
            </div>
          </div>
          <!-- Products Display -->
          <div>
            <!-- Grid View -->
            <div
              class="products-grid"
              *ngIf="viewMode === 'grid'"
              [class.loading]="isLoading"
            >
              <div
                class="product-item"
                *ngFor="
                  let product of paginatedProducts;
                  trackBy: trackByProductId
                "
                [class.out-of-stock]="product.stock === 0"
                (click)="addProductToCart(product)"
              >
                <img
                  [src]="product.images[0] || '/assets/placeholder.svg'"
                  [alt]="product.name"
                  class="product-image"
                  (error)="onImageError($event)"
                />
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">
                    {{ product.price | currency : 'VND' : 'symbol' : '1.0-0' }}
                  </div>
                  <div
                    class="product-stock"
                    [class]="getStockClass(product.stock)"
                  >
                    {{
                      product.stock > 0 ? 'SL: ' + product.stock : 'Hết hàng'
                    }}
                  </div>
                </div>
                <button
                  class="add-btn"
                  [disabled]="product.stock === 0"
                  (click)="addProductToCart(product); $event.stopPropagation()"
                >
                  <i class="pi pi-plus"></i>
                </button>
              </div>
            </div>
            <!-- Pagination for Grid View with PrimeNG Paginator -->
            <div
              class="pagination-section grid-pagination"
              *ngIf="filteredProducts.length > 0 && viewMode === 'grid'"
            >
              <p-paginator
                [first]="(currentPage - 1) * pageSize"
                [rows]="pageSize"
                [totalRecords]="filteredProducts.length"
                (onPageChange)="onPageChange($event)"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Hiển thị {first} - {last} trong {totalRecords} sản phẩm"
                styleClass="custom-paginator"
                [alwaysShow]="true"
              ></p-paginator>
            </div>

            <!-- List View -->
            <div
              class="products-list"
              *ngIf="viewMode === 'list'"
              [class.loading]="isLoading"
            >
              <div class="list-header">
                <div class="col-image">Ảnh</div>
                <div class="col-name">Tên sản phẩm</div>
                <div class="col-code">Mã SP</div>
                <div class="col-price">Giá</div>
                <div class="col-stock">Kho</div>
                <div class="col-action">Thao tác</div>
              </div>

              <div
                class="list-item"
                *ngFor="
                  let product of paginatedProducts;
                  trackBy: trackByProductId
                "
                [class.out-of-stock]="product.stock === 0"
                (click)="addProductToCart(product)"
              >
                <div class="col-image">
                  <img
                    [src]="product.images[0] || '/assets/placeholder.svg'"
                    [alt]="product.name"
                    class="list-product-image"
                    (error)="onImageError($event)"
                  />
                </div>
                <div class="col-name">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-category">{{ product.category }}</div>
                </div>
                <div class="col-code">{{ product.code }}</div>
                <div class="col-price">
                  {{ product.price | currency : 'VND' : 'symbol' : '1.0-0' }}
                </div>
                <div class="col-stock">
                  <span
                    class="stock-badge"
                    [class]="getStockClass(product.stock)"
                  >
                    {{ product.stock > 0 ? product.stock : 'Hết' }}
                  </span>
                </div>
                <div class="col-action">
                  <button
                    class="add-btn-list"
                    [disabled]="product.stock === 0"
                    (click)="
                      addProductToCart(product); $event.stopPropagation()
                    "
                    pTooltip="Thêm vào giỏ"
                  >
                    <i class="pi pi-plus"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Pagination with PrimeNG Paginator -->
            <div
              class="pagination-section"
              *ngIf="filteredProducts.length > 0 && viewMode === 'list'"
            >
              <p-paginator
                [first]="(currentPage - 1) * pageSize"
                [rows]="pageSize"
                [totalRecords]="filteredProducts.length"
                (onPageChange)="onPageChange($event)"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Hiển thị {first} - {last} trong {totalRecords} sản phẩm"
                styleClass="custom-paginator"
                [alwaysShow]="true"
              ></p-paginator>
            </div>

            <!-- No Products Message -->
            <div
              *ngIf="filteredProducts.length === 0 && !isLoading"
              class="no-products"
            >
              <i class="pi pi-search"></i>
              <span>Không tìm thấy sản phẩm</span>
              <button
                class="clear-search-btn"
                (click)="clearFilters()"
                *ngIf="productSearchTerm || selectedCategory"
              >
                Xóa bộ lọc
              </button>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="loading-state">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Đang tải sản phẩm...</span>
            </div>
          </div>
        </div>

        <!-- Right Panel: Cart & Payment -->
        <div class="cart-panel">
          <!-- Cart Header -->
          <div class="cart-header">
            <h4 class="m-0">Giỏ hàng ({{ (cart$ | async)?.length || 0 }})</h4>
            <p-button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              [text]="true"
              pTooltip="Xóa tất cả"
              (onClick)="clearCart()"
              [disabled]="(cart$ | async)?.length === 0"
            ></p-button>
          </div>

          <!-- Cart Items -->
          <div class="cart-items">
            <div
              *ngFor="let item of cart$ | async; trackBy: trackByCartItem"
              class="cart-item"
            >
              <img
                [src]="item.productImage"
                [alt]="item.productName"
                class="cart-item-image"
                (error)="onImageError($event)"
              />
              <div class="cart-item-info">
                <div class="item-name">{{ item.productName }}</div>
                <div class="item-price">
                  {{ item.price | currency : 'VND' : 'symbol' : '1.0-0' }}
                </div>
              </div>
              <div class="quantity-controls">
                <button
                  class="qty-btn"
                  (click)="decreaseQuantity(item.productId)"
                  [disabled]="item.quantity <= 1"
                >
                  <i class="pi pi-minus"></i>
                </button>
                <span class="qty-display">{{ item.quantity }}</span>
                <button
                  class="qty-btn"
                  (click)="increaseQuantity(item.productId)"
                >
                  <i class="pi pi-plus"></i>
                </button>
                <button
                  class="remove-btn"
                  (click)="removeFromCart(item.productId)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <div class="item-total">
                {{ item.totalPrice | currency : 'VND' : 'symbol' : '1.0-0' }}
              </div>
            </div>

            <div *ngIf="(cart$ | async)?.length === 0" class="empty-cart">
              <i class="pi pi-shopping-cart"></i>
              <span>Giỏ hàng trống</span>
            </div>
          </div>

          <!-- Customer Section -->
          <div class="customer-section">
            <label class="section-label">Khách hàng:</label>
            <div class="flex gap-1">
              <p-dropdown
                [options]="(customers$ | async) || []"
                [(ngModel)]="selectedCustomer"
                optionLabel="name"
                placeholder="Chọn khách hàng"
                [filter]="true"
                filterBy="name,phone"
                [showClear]="true"
                class="flex-1"
                styleClass="compact-dropdown"
                (onChange)="onCustomerSelect()"
              >
                <ng-template pTemplate="selectedItem">
                  <div *ngIf="selectedCustomer" class="customer-selected">
                    <div class="customer-name">{{ selectedCustomer.name }}</div>
                    <div class="customer-phone">
                      {{ selectedCustomer.phone }}
                    </div>
                  </div>
                </ng-template>
                <ng-template pTemplate="item" let-customer>
                  <div class="customer-option">
                    <div class="customer-name">{{ customer.name }}</div>
                    <div class="customer-details">
                      {{ customer.phone }} - {{ customer.membershipLevel }}
                    </div>
                  </div>
                </ng-template>
              </p-dropdown>
              <button
                class="add-customer-btn"
                (click)="showCustomerDialog = true"
              >
                <i class="pi pi-plus"></i>
              </button>
            </div>

            <div *ngIf="selectedCustomer" class="customer-info">
              <span class="loyalty-points"
                >Điểm: {{ selectedCustomer.loyaltyPoints }}</span
              >
              <span class="membership-level">{{
                selectedCustomer.membershipLevel
              }}</span>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-line">
              <span>Tạm tính:</span>
              <span>{{
                getSubtotal() | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="summary-line" *ngIf="getDiscount() > 0">
              <span>Giảm giá:</span>
              <span class="discount"
                >-{{
                  getDiscount() | currency : 'VND' : 'symbol' : '1.0-0'
                }}</span
              >
            </div>
            <div class="summary-line total-line">
              <span>Tổng cộng:</span>
              <span class="total-amount">{{
                getTotal() | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
          </div>

          <!-- Payment Buttons -->
          <div class="payment-buttons">
            <button
              class="payment-btn cash-btn"
              [disabled]="(cart$ | async)?.length === 0"
              (click)="processPayment('cash')"
            >
              <i class="pi pi-money-bill"></i>
              <span>Tiền mặt</span>
            </button>
            <button
              class="payment-btn card-btn"
              [disabled]="(cart$ | async)?.length === 0"
              (click)="processPayment('card')"
            >
              <i class="pi pi-credit-card"></i>
              <span>Thẻ</span>
            </button>
            <button
              class="payment-btn digital-btn"
              [disabled]="(cart$ | async)?.length === 0"
              (click)="processPayment('digital')"
            >
              <i class="pi pi-mobile"></i>
              <span>Ví điện tử</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Customer Dialog -->
      <p-dialog
        header="Thêm khách hàng mới"
        [(visible)]="showCustomerDialog"
        [modal]="true"
        [style]="{ width: '350px' }"
        [baseZIndex]="9000"
        styleClass="compact-dialog"
        (onHide)="onDialogHide()"
      >
        <div class="customer-form">
          <div class="form-field">
            <label>Tên khách hàng *</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="newCustomer.name"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label>Số điện thoại *</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="newCustomer.phone"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label>Email</label>
            <input
              type="email"
              pInputText
              [(ngModel)]="newCustomer.email"
              class="form-input"
            />
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button class="btn-secondary" (click)="showCustomerDialog = false">
              Hủy
            </button>
            <button
              class="btn-primary"
              (click)="addNewCustomer()"
              [disabled]="!newCustomer.name || !newCustomer.phone"
            >
              Lưu
            </button>
          </div>
        </ng-template>
      </p-dialog>
      <!-- Payment Confirmation Dialog -->
      <p-dialog
        header="Thanh toán thành công"
        [(visible)]="showPaymentDialog"
        [modal]="true"
        [style]="{ width: '400px' }"
        [baseZIndex]="9000"
        styleClass="compact-dialog"
        (onHide)="onPaymentDialogHide()"
      >
        <div class="payment-success">
          <div class="success-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h4>Giao dịch hoàn tất!</h4>

          <div class="payment-details">
            <div class="detail-line">
              <span>Tổng tiền:</span>
              <span class="amount">{{
                lastPaymentAmount | currency : 'VND' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="detail-line">
              <span>Phương thức:</span>
              <span>{{ getPaymentMethodLabel(lastPaymentMethod) }}</span>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button class="btn-secondary" (click)="printReceipt()">
              <i class="pi pi-print"></i> In hóa đơn
            </button>
            <button class="btn-primary" (click)="startNewTransaction()">
              <i class="pi pi-plus"></i> Giao dịch mới
            </button>
          </div>
        </ng-template>
      </p-dialog>

      <!-- Receipt Component -->
      <app-receipt
        [visible]="showReceipt"
        [receipt]="currentReceipt"
        (visibleChange)="showReceipt = $event"
      ></app-receipt>
    </div>
  `,
  styles: [
    `
      .pos-sales-container {
        min-height: 100vh;
        background-color: #f8f9fa;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
      }

      /* Ultra Compact Header */
      .header-bar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 0.25rem 0.75rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 5; /* Reduced z-index to avoid overlapping with toasts and dialogs */
        height: 42px;
        min-height: 42px;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .header-icon {
        color: #ffffff;
        font-size: 1rem;
      }

      .header-title {
        color: #ffffff;
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 0.25rem;
      }

      ::ng-deep .header-actions .p-button {
        border-radius: 4px;
        height: 28px;
        width: 28px;
        padding: 0;
      }
      ::ng-deep .header-actions .p-button:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      } /* Main Layout */
      .main-layout {
        display: flex;
        height: calc(100vh - 42px);
        overflow: hidden;
      } /* Fix for PrimeNG Toast and Dialog z-index */
      ::ng-deep .p-toast {
        z-index: 9999 !important;
      }
      ::ng-deep .p-dialog {
        z-index: 9000 !important;
        position: relative !important;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important;
      }

      ::ng-deep .p-dialog-mask {
        z-index: 8999 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }

      /* Additional fixes for dialog components */
      ::ng-deep .p-dialog .p-dialog-header {
        z-index: 9001 !important;
      }

      ::ng-deep .p-dialog .p-dialog-content {
        z-index: 9001 !important;
      }

      ::ng-deep .p-dialog .p-dialog-footer {
        z-index: 9001 !important;
      } /* Left Panel - Products */
      .products-panel {
        flex: 2;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-right: 1px solid #e9ecef;
      } /* Compact Search Section */
      .search-section {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f1f3f4;
        background: #f8f9fa;
      }

      .search-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .search-input-group {
        flex: 1;
        min-width: 0;
        position: relative;
      }

      .search-input-group i.pi-search {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        pointer-events: none;
      }

      .search-input-field {
        width: 100%;
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
        padding-left: 2.5rem;
        height: 38px;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
      }

      .filter-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-shrink: 0;
      }

      .view-toggle {
        display: flex;
        gap: 0.25rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.125rem;
        background: #ffffff;
      }

      .category-dropdown {
        min-width: 140px;
      }

      ::ng-deep .category-dropdown .p-dropdown {
        height: 38px;
        font-size: 0.875rem;
      }
      .search-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 0;
        border-top: 1px solid #e9ecef;
        margin-top: 0.5rem;
        font-size: 0.75rem;
      }

      .results-count {
        color: #6b7280;
        font-weight: 500;
      }

      .clear-filters {
        background: #f3f4f6;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        color: #374151;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        transition: all 0.2s ease;
      }

      .clear-filters:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }

      /* View Mode Buttons */
      ::ng-deep .p-button.active {
        background: #2563eb !important;
        color: white !important;
      }

      /* Products Container */
      .products-container {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .products-grid {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
        align-content: start;
      }

      .products-grid.loading {
        opacity: 0.6;
        pointer-events: none;
      }

      /* List View Styles */
      .products-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .products-list.loading {
        opacity: 0.6;
        pointer-events: none;
      }

      .list-header {
        display: grid;
        grid-template-columns: 60px 1fr 120px 100px 80px 80px;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: #f8f9fa;
        border-bottom: 2px solid #e9ecef;
        font-weight: 600;
        font-size: 0.875rem;
        color: #374151;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .list-item {
        display: grid;
        grid-template-columns: 60px 1fr 120px 100px 80px 80px;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f1f3f4;
        cursor: pointer;
        transition: background-color 0.2s ease;
        align-items: center;
      }

      .list-item:hover {
        background: #f8f9fa;
      }

      .list-item.out-of-stock {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .list-item.out-of-stock:hover {
        background: #fef2f2;
      }

      .col-image {
        display: flex;
        justify-content: center;
      }

      .list-product-image {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 0.25rem;
      }

      .col-name .product-name {
        font-weight: 500;
        font-size: 0.875rem;
        color: #1f2937;
        line-height: 1.2;
        margin-bottom: 0.25rem;
      }

      .col-name .product-category {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .col-code {
        font-family: monospace;
        font-size: 0.75rem;
        color: #374151;
      }

      .col-price {
        font-weight: 600;
        color: #dc2626;
        font-size: 0.875rem;
      }

      .col-stock {
        display: flex;
        justify-content: center;
      }

      .stock-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
        text-align: center;
        min-width: 50px;
      }

      .stock-badge.in-stock {
        background: #d1fae5;
        color: #065f46;
      }

      .stock-badge.low-stock {
        background: #fef3c7;
        color: #92400e;
      }

      .stock-badge.out-of-stock {
        background: #fecaca;
        color: #991b1b;
      }

      .col-action {
        display: flex;
        justify-content: center;
      }

      .add-btn-list {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.25rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .add-btn-list:hover {
        background: #1d4ed8;
        transform: scale(1.05);
      }

      .add-btn-list:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }

      /* Pagination Styles */
      .pagination-section {
        padding: 1rem;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .pagination-info {
        font-size: 0.875rem;
        color: #6b7280;
      }

      .pagination-controls {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .page-btn,
      .page-number {
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }

      .page-btn:hover:not(:disabled),
      .page-number:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }

      .page-number.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
      }

      .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .page-size-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
      }

      .page-size-selector select {
        padding: 0.25rem 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        background: white;
        font-size: 0.875rem;
      }

      /* Custom PrimeNG Paginator Styling */
      .pagination-section {
        padding: 0.75rem 1rem;
        border-top: 1px solid #e9ecef;
        background: #f8f9fa;
      }

      ::ng-deep .custom-paginator {
        background: transparent;
        border: none;
        padding: 0;
      }

      ::ng-deep .custom-paginator .p-paginator-page {
        min-width: 32px;
        height: 32px;
        margin: 0 0.125rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }

      ::ng-deep .custom-paginator .p-paginator-page.p-highlight {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
      }

      ::ng-deep .custom-paginator .p-paginator-prev,
      ::ng-deep .custom-paginator .p-paginator-next,
      ::ng-deep .custom-paginator .p-paginator-first,
      ::ng-deep .custom-paginator .p-paginator-last {
        min-width: 32px;
        height: 32px;
        border-radius: 0.25rem;
      }

      ::ng-deep .custom-paginator .p-dropdown {
        height: 32px;
        min-width: 60px;
      }

      ::ng-deep .custom-paginator .p-paginator-current {
        margin-right: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
      }

      /* Loading and Empty States */
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: #6b7280;
        gap: 1rem;
      }

      .loading-state i {
        font-size: 2rem;
        color: #2563eb;
      }

      .no-products {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        color: #6b7280;
        gap: 1rem;
      }

      .no-products i {
        font-size: 2rem;
        color: #d1d5db;
      }

      .clear-search-btn {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        margin-top: 1rem;
      }

      .clear-search-btn:hover {
        background: #1d4ed8;
      }
      .product-item {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 0.375rem;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 120px;
      }

      .product-item:hover {
        border-color: #2563eb;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        transform: translateY(-1px);
      }

      .product-item.out-of-stock {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .product-image {
        width: 100%;
        height: 50px;
        object-fit: cover;
        border-radius: 0.25rem;
        margin-bottom: 0.4rem;
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .product-name {
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.2;
        color: #1f2937;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .product-price {
        font-size: 0.8rem;
        font-weight: 600;
        color: #dc2626;
      }

      .product-stock {
        font-size: 0.7rem;
        color: #6b7280;
      }

      .product-stock.low-stock {
        color: #f59e0b;
      }

      .product-stock.out-of-stock {
        color: #dc2626;
      }

      .add-btn {
        position: absolute;
        top: 0.3rem;
        right: 0.3rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s ease;
        opacity: 0;
      }

      .product-item:hover .add-btn {
        opacity: 1;
      }

      .add-btn:hover {
        background: #1d4ed8;
        transform: scale(1.1);
      }

      .add-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }
      .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
        color: #6b7280;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .no-products i {
        font-size: 2rem;
        color: #d1d5db;
      }

      /* Responsive adjustments for list view */
      @media (max-width: 1024px) {
        .list-header,
        .list-item {
          grid-template-columns: 50px 1fr 80px 60px 60px;
          gap: 0.5rem;
        }

        .col-code {
          display: none;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }

      @media (max-width: 768px) {
        .pagination-section {
          flex-direction: column;
          gap: 0.5rem;
        }

        .list-header,
        .list-item {
          grid-template-columns: 40px 1fr 60px 50px;
          gap: 0.25rem;
          padding: 0.5rem;
        }

        .col-price,
        .col-action {
          font-size: 0.75rem;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .product-item {
          height: 120px;
        }

        .product-image {
          height: 50px;
        }
        .payment-buttons {
          grid-template-columns: 1fr;
          gap: 0.3rem;
        }

        .payment-btn {
          height: 44px;
          min-height: 44px;
          font-size: 0.7rem;
        }

        .customer-section {
          padding: 0.5rem 0.75rem;
        }

        .order-summary {
          padding: 0.5rem 0.75rem;
        }

        .payment-buttons {
          padding: 0.5rem 0.75rem;
        }
      } /* Compact Cart Panel */
      .cart-panel {
        flex: 1;
        min-width: 320px;
        background: #fff;
        display: flex;
        flex-direction: column;
      }

      .cart-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
      }

      .cart-header h4 {
        color: #1f2937;
        font-size: 1rem;
        margin: 0;
      }

      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem 1rem;
        max-height: 280px;
      }

      .cart-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f3f4;
      }

      .cart-item:last-child {
        border-bottom: none;
      }

      .cart-item-image {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 0.25rem;
        flex-shrink: 0;
      }

      .cart-item-info {
        flex: 1;
        min-width: 0;
      }

      .item-name {
        font-size: 0.8rem;
        font-weight: 500;
        color: #1f2937;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0.1rem;
      }

      .item-price {
        font-size: 0.7rem;
        color: #6b7280;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        flex-shrink: 0;
      }

      .qty-btn,
      .remove-btn {
        background: #f3f4f6;
        border: none;
        border-radius: 0.2rem;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.7rem;
        transition: all 0.2s ease;
      }

      .qty-btn:hover {
        background: #e5e7eb;
      }

      .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .remove-btn {
        background: #fef2f2;
        color: #dc2626;
        margin-left: 0.25rem;
      }

      .remove-btn:hover {
        background: #fee2e2;
      }

      .qty-display {
        min-width: 24px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .item-total {
        font-size: 0.8rem;
        font-weight: 600;
        color: #dc2626;
        flex-shrink: 0;
        min-width: 60px;
        text-align: right;
      }

      .empty-cart {
        text-align: center;
        padding: 2rem 1rem;
        color: #9ca3af;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .empty-cart i {
        font-size: 2rem;
        color: #d1d5db;
      } /* Compact Customer Section */
      .customer-section {
        padding: 0.75rem 1rem;
        border-top: 1px solid #e9ecef;
        background: #f8f9fa;
      }

      .customer-section .flex {
        display: flex;
        align-items: center;
      }

      .customer-section .gap-1 {
        gap: 0.25rem;
      }

      .customer-section .flex-1 {
        flex: 1;
      }

      .section-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.4rem;
        display: block;
      }

      .customer-info {
        margin-top: 0.4rem;
        display: flex;
        gap: 0.75rem;
        font-size: 0.7rem;
      }

      .loyalty-points {
        color: #059669;
        font-weight: 500;
      }

      .membership-level {
        color: #7c3aed;
        font-weight: 500;
      }

      .add-customer-btn {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.25rem;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.7rem;
        flex-shrink: 0;
      }

      .add-customer-btn:hover {
        background: #1d4ed8;
        transform: scale(1.05);
      } /* Compact Order Summary */
      .order-summary {
        padding: 0.75rem 1rem;
        border-top: 1px solid #e9ecef;
        background: #f8f9fa;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        line-height: 1.2;
      }

      .summary-line:last-child {
        margin-bottom: 0;
      }

      .discount {
        color: #059669;
        font-weight: 500;
      }

      .total-line {
        border-top: 1px solid #d1d5db;
        padding-top: 0.4rem;
        margin-top: 0.4rem;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .total-amount {
        color: #dc2626;
        font-size: 1rem;
        font-weight: 700;
      } /* Compact Payment Buttons */
      .payment-buttons {
        padding: 0.75rem 1rem;
        background: #fff;
        border-top: 1px solid #e9ecef;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.4rem;
      }

      .payment-btn {
        padding: 0.5rem 0.4rem;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        height: 50px;
        min-height: 50px;
      }

      .cash-btn {
        background: #059669;
        color: white;
      }

      .cash-btn:hover {
        background: #047857;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
      }

      .card-btn {
        background: #2563eb;
        color: white;
      }

      .card-btn:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
      }

      .digital-btn {
        background: #7c3aed;
        color: white;
      }

      .digital-btn:hover {
        background: #6d28d9;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);
      }

      .payment-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .payment-btn:disabled:hover {
        transform: none;
        box-shadow: none;
      }

      .payment-btn i {
        font-size: 1rem;
      } /* Dialogs with Fixed Z-Index */
      ::ng-deep .compact-dialog .p-dialog {
        max-width: 90vw;
        z-index: 1100 !important;
      }

      ::ng-deep .compact-dialog .p-dialog-mask {
        z-index: 1099 !important;
        background: rgba(0, 0, 0, 0.4);
      }

      ::ng-deep .compact-dialog .p-dialog-header {
        padding: 0.75rem 1rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        font-size: 0.875rem;
        font-weight: 600;
      }

      ::ng-deep .compact-dialog .p-dialog-content {
        padding: 1rem;
      }

      /* Ensure all PrimeNG dialogs have high z-index */
      ::ng-deep .p-dialog {
        z-index: 1100 !important;
      }

      ::ng-deep .p-dialog-mask {
        z-index: 1099 !important;
      }

      .customer-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-field label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
      }

      .form-input {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }

      .dialog-footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: #2563eb;
        color: white;
      }

      .btn-primary:hover {
        background: #1d4ed8;
      }

      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }

      /* Payment Success Dialog */
      .payment-success {
        text-align: center;
        padding: 1rem 0;
      }

      .success-icon {
        color: #059669;
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .payment-details {
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 0.5rem;
      }

      .detail-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      .detail-line:last-child {
        margin-bottom: 0;
      }

      .amount {
        font-weight: 600;
        color: #dc2626;
      } /* Dropdown customizations */
      ::ng-deep .compact-dropdown .p-dropdown {
        font-size: 0.8rem;
        height: 28px;
      }

      ::ng-deep .compact-dropdown .p-dropdown-label {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }

      ::ng-deep .compact-dropdown .p-dropdown-trigger {
        width: 24px;
      }

      /* Customer dropdown customizations */
      .customer-selected,
      .customer-option {
        padding: 0.2rem 0;
      }

      .customer-name {
        font-weight: 500;
        font-size: 0.8rem;
        line-height: 1.2;
      }

      .customer-phone,
      .customer-details {
        font-size: 0.7rem;
        color: #6b7280;
        line-height: 1.1;
      } /* Responsive */
      @media (max-width: 1024px) {
        .main-layout {
          flex-direction: column;
          height: auto;
        }

        .products-panel {
          height: 50vh;
        }

        .cart-panel {
          min-width: auto;
        }
      }
    `,
  ],
})
export class SalesPOSComponent implements OnInit {
  // Observables
  products$!: Observable<Product[]>;
  cart$!: Observable<CartItem[]>;
  customers$!: Observable<Customer[]>;
  // Search and filter
  productSearchTerm = '';
  selectedCategory: string | null = null;
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  // View mode and pagination
  viewMode: 'grid' | 'list' = 'list'; // Default to list view for better scalability
  currentPage = 1;
  pageSize = 5; // Show 5 items per page as requested
  paginatedProducts: Product[] = [];
  isLoading = false;
  searchDebounceTimer: any;
  // Categories
  categories: CategoryFilter[] = [
    { label: 'Váy', value: 'Dresses' },
    { label: 'Áo sơ mi', value: 'Shirts' },
    { label: 'Quần jeans', value: 'Jeans' },
    { label: 'Áo khoác', value: 'Jackets' },
    { label: 'Giày', value: 'Shoes' },
    { label: 'Phụ kiện', value: 'Accessories' },
  ];

  // Customer
  selectedCustomer: Customer | null = null;
  showCustomerDialog = false;
  newCustomer = {
    name: '',
    phone: '',
    email: '',
    address: '',
  }; // Payment
  showPaymentDialog = false;
  lastPaymentAmount = 0;
  lastPaymentMethod = '';
  loyaltyPointsUsed = 0;
  currentDate = new Date();

  // Receipt
  showReceipt = false;
  currentReceipt: Receipt | null = null;
  constructor(
    private store: Store<AppState>,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialize observables
    this.products$ = this.store.select(ProductSelectors.selectAllProducts);
    this.cart$ = this.store.select(POSSelectors.selectCart);
    this.customers$ = this.store.select(CustomerSelectors.selectAllCustomers);

    // Load initial data
    this.store.dispatch(ProductActions.loadProducts());
    this.store.dispatch(CustomerActions.loadCustomers());

    // Subscribe to route params to get page number
    this.route.params.subscribe((params) => {
      if (params['page']) {
        const pageNumber = parseInt(params['page'], 10);
        if (!isNaN(pageNumber) && pageNumber > 0) {
          this.currentPage = pageNumber;
        }
      }

      // Subscribe to products after getting page number from URL
      this.products$.subscribe((products) => {
        console.log('Loaded products:', products); // Debug log
        this.allProducts = products;
        this.filterProducts();
      });
    });

    // Show welcome message
    this.messageService.add({
      severity: 'info',
      summary: 'Chào mừng',
      detail: 'Hệ thống POS đã sẵn sâng để phục vụ!',
      life: 3000,
    });
  }

  // Computed properties for pagination
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    // Adjust if we're near the boundaries
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  Math = Math; // Expose Math to template

  onSearchInput() {
    // Debounce search input
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.filterProducts();
    }, 300);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
    this.updatePagination();
  }

  clearFilters() {
    this.productSearchTerm = '';
    this.selectedCategory = null;
    this.filterProducts();
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();

      // Update URL with new page number
      this.router.navigate(['/sales/page', page]);
    }
  }

  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.updatePagination();

    // Update URL with new page number
    this.router.navigate(['/sales/page', this.currentPage]);
  }

  onPageSizeChange() {
    this.currentPage = 1; // Reset to first page
    this.updatePagination();

    // Update URL to first page when page size changes
    this.router.navigate(['/sales/page', 1]);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  filterProducts() {
    this.isLoading = true;

    // Simulate loading delay for better UX
    setTimeout(() => {
      let filtered = [...this.allProducts];

      // Filter by search term (improved search)
      if (this.productSearchTerm) {
        const searchTerm = this.productSearchTerm.toLowerCase().trim();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.code.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === this.selectedCategory
        );
      }

      // Sort by availability and popularity
      filtered.sort((a, b) => {
        // Out of stock items go to the end
        if (a.stock === 0 && b.stock > 0) return 1;
        if (b.stock === 0 && a.stock > 0) return -1;

        // Sort by rating for available items
        return (b.rating || 0) - (a.rating || 0);
      });

      this.filteredProducts = filtered;
      this.currentPage = 1; // Reset to first page when filtering
      this.updatePagination();
      this.isLoading = false;

      // Show search results info
      if (this.productSearchTerm && filtered.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Không tìm thấy',
          detail: `Không có sản phẩm nào phù hợp với "${this.productSearchTerm}"`,
          life: 3000,
        });
      }
    }, 200);
  }
  addProductToCart(product: Product) {
    // Kiểm tra sản phẩm có còn hàng không
    if (product.stock <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hết hàng',
        detail: `${product.name} hiện đã hết hàng`,
        life: 4000,
      });
      return;
    }

    // Sử dụng take(1) để chỉ lấy giá trị hiện tại một lần duy nhất
    this.store
      .select(POSSelectors.selectCart)
      .pipe(take(1))
      .subscribe((cart) => {
        const existingItem = cart.find((item) => item.productId === product.id);

        if (existingItem) {
          // Kiểm tra số lượng trong kho
          if (existingItem.quantity >= product.stock) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Vượt quá số lượng',
              detail: `Không thể thêm ${product.name}. Số lượng trong kho chỉ còn ${product.stock}`,
              life: 4000,
            });
            return;
          }

          // Nếu sản phẩm đã tồn tại trong giỏ hàng, chỉ tăng thêm 1
          this.store.dispatch(
            POSActions.updateCartItemQuantity({
              productId: product.id,
              quantity: existingItem.quantity + 1,
            })
          );
        } else {
          // Nếu sản phẩm chưa tồn tại trong giỏ hàng, tạo mới với số lượng là 1
          const cartItem: CartItem = {
            productId: product.id,
            productName: product.name,
            productImage: product.images?.[0] || '/assets/placeholder.svg',
            price: product.price,
            quantity: 1,
            totalPrice: product.price,
          };

          this.store.dispatch(POSActions.addToCart({ item: cartItem }));
        }

        // Hiển thị thông báo thành công một lần duy nhất
        this.messageService.add({
          severity: 'success',
          summary: 'Đã thêm vào giỏ',
          detail: `${product.name} đã được thêm vào giỏ hàng`,
          life: 2000,
        });
      });
  }

  quickAddProduct() {
    if (!this.productSearchTerm || this.productSearchTerm.trim().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Tìm kiếm trống',
        detail: 'Vui lòng nhập mã sản phẩm',
        life: 3000,
      });
      return;
    }

    const searchTerm = this.productSearchTerm.trim().toLowerCase();
    // Try to find exact match by product code or ID
    const exactMatch = this.allProducts.find(
      (product) =>
        product.code.toLowerCase() === searchTerm ||
        product.id.toLowerCase() === searchTerm
    );

    if (exactMatch) {
      // Found exact match, add to cart
      this.addProductToCart(exactMatch);

      // Clear search after successful addition
      this.productSearchTerm = '';
      this.filterProducts();

      this.messageService.add({
        severity: 'success',
        summary: 'Quét thành công',
        detail: `Đã quét và thêm ${exactMatch.name} vào giỏ hàng`,
        life: 2000,
      });
    } else {
      // Try partial match and show suggestions
      const partialMatches = this.allProducts
        .filter(
          (product) =>
            product.code.toLowerCase().includes(searchTerm) ||
            product.name.toLowerCase().includes(searchTerm)
        )
        .slice(0, 3);

      if (partialMatches.length === 1) {
        // Only one partial match, add it
        this.addProductToCart(partialMatches[0]);
        this.productSearchTerm = '';
        this.filterProducts();

        this.messageService.add({
          severity: 'success',
          summary: 'Tìm thấy',
          detail: `Đã thêm ${partialMatches[0].name} vào giỏ hàng`,
          life: 2000,
        });
      } else if (partialMatches.length > 1) {
        // Multiple matches, show them in filtered results
        this.filteredProducts = partialMatches;

        this.messageService.add({
          severity: 'info',
          summary: 'Nhiều kết quả',
          detail: `Tìm thấy ${partialMatches.length} sản phẩm phù hợp. Chọn sản phẩm để thêm vào giỏ.`,
          life: 4000,
        });
      } else {
        // No matches found
        this.messageService.add({
          severity: 'error',
          summary: 'Không tìm thấy',
          detail: `Không tìm thấy sản phẩm với mã "${this.productSearchTerm}"`,
          life: 4000,
        });
      }
    }
  }
  increaseQuantity(productId: string) {
    // Lấy số lượng hiện tại và tăng lên 1, sử dụng take(1) để tránh lặp vô hạn
    this.store
      .select(POSSelectors.selectCart)
      .pipe(take(1))
      .subscribe((cart) => {
        const existingItem = cart.find((item) => item.productId === productId);
        if (existingItem) {
          // Tìm sản phẩm để kiểm tra số lượng kho
          const product = this.allProducts.find((p) => p.id === productId);
          if (product && existingItem.quantity >= product.stock) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Vượt quá số lượng',
              detail: `Không thể thêm ${product.name}. Số lượng trong kho chỉ còn ${product.stock}`,
              life: 4000,
            });
            return;
          }

          this.store.dispatch(
            POSActions.updateCartItemQuantity({
              productId,
              quantity: existingItem.quantity + 1,
            })
          );
        }
      });
  }
  decreaseQuantity(productId: string) {
    // Lấy số lượng hiện tại và giảm xuống 1, sử dụng take(1) để tránh lặp vô hạn
    this.store
      .select(POSSelectors.selectCart)
      .pipe(take(1))
      .subscribe((cart) => {
        const existingItem = cart.find((item) => item.productId === productId);
        if (existingItem && existingItem.quantity > 1) {
          this.store.dispatch(
            POSActions.updateCartItemQuantity({
              productId,
              quantity: existingItem.quantity - 1,
            })
          );
        }
      });
  }

  removeFromCart(productId: string) {
    this.store.dispatch(POSActions.removeFromCart({ productId }));
    this.messageService.add({
      severity: 'info',
      summary: 'Đã xóa',
      detail: 'Sản phẩm đã được xóa khỏi giỏ hàng',
    });
  }

  clearCart() {
    this.store.dispatch(POSActions.clearCart());
    this.selectedCustomer = null;
    this.loyaltyPointsUsed = 0;
    this.messageService.add({
      severity: 'info',
      summary: 'Đã xóa',
      detail: 'Giỏ hàng đã được xóa',
    });
  }

  onCustomerSelect() {
    if (this.selectedCustomer) {
      this.store.dispatch(
        POSActions.selectCustomer({ customer: this.selectedCustomer })
      );
    }
  }

  addNewCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.phone) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập tên và số điện thoại',
      });
      return;
    }
    const customer: Customer = {
      id: 'CUST_' + Date.now().toString(),
      name: this.newCustomer.name,
      phone: this.newCustomer.phone,
      email: this.newCustomer.email,
      address: this.newCustomer.address,
      membershipLevel: 'Bronze',
      loyaltyPoints: 0,
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.store.dispatch(CustomerActions.addCustomer({ customer }));

    this.showCustomerDialog = false;
    this.newCustomer = { name: '', phone: '', email: '', address: '' };

    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Khách hàng mới đã được thêm',
    });
  }
  processPayment(method: 'cash' | 'card' | 'digital') {
    this.cart$
      .subscribe((cart) => {
        if (!cart || cart.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Giỏ hàng trống',
          });
          return;
        }

        const total = this.getTotal();
        const subtotal = this.getSubtotal();
        const discount = this.getDiscount();

        const paymentMethod: PaymentMethod = {
          type: method,
          amount: total,
        };

        const cashierInfo = {
          id: 'staff001',
          name: 'Nhân viên bán hàng',
        };

        // Generate receipt
        this.currentReceipt = this.generateReceipt(
          cart,
          subtotal,
          discount,
          total,
          [paymentMethod],
          cashierInfo
        );

        this.store.dispatch(
          POSActions.processPayment({
            customerId: this.selectedCustomer?.id,
            loyaltyPointsUsed: this.loyaltyPointsUsed,
            paymentMethods: [paymentMethod],
            cashierInfo,
          })
        );

        this.lastPaymentAmount = total;
        this.lastPaymentMethod = method;
        this.showPaymentDialog = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Thanh toán thành công',
          detail: `Đã thanh toán ${total.toLocaleString('vi-VN')} VND`,
        });
      })
      .unsubscribe();
  }
  startNewTransaction() {
    this.clearCart();
    this.showPaymentDialog = false;
    this.showReceipt = false;
    this.currentReceipt = null;
    this.lastPaymentAmount = 0;
    this.lastPaymentMethod = '';
  }
  printReceipt() {
    if (this.currentReceipt) {
      this.showReceipt = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Không có hóa đơn để in',
      });
    }
  }

  showReceiptDialog() {
    if (this.currentReceipt) {
      this.showReceipt = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Không có hóa đơn để hiển thị',
      });
    }
  }

  generateReceipt(
    cart: CartItem[],
    subtotal: number,
    discount: number,
    total: number,
    paymentMethods: PaymentMethod[],
    cashierInfo: { id: string; name: string }
  ): Receipt {
    const loyaltyPointsEarned = Math.floor(total / 10000); // 1 point per 10,000 VND

    return {
      receiptNumber: `RC-${Date.now()}`,
      saleId: `SALE-${Date.now()}`,
      customerInfo: this.selectedCustomer
        ? {
            name: this.selectedCustomer.name,
            membershipLevel: this.selectedCustomer.membershipLevel,
            loyaltyPoints: this.selectedCustomer.loyaltyPoints,
          }
        : undefined,
      items: cart,
      subtotal,
      discount,
      loyaltyPointsUsed: this.loyaltyPointsUsed,
      loyaltyPointsEarned,
      total,
      paymentMethods,
      cashierName: cashierInfo.name,
      saleDate: new Date(),
      storeInfo: {
        name: 'Fashion Shop',
        address: '123 Đường ABC, Quận XYZ, TP.HCM',
        phone: '(028) 1234-5678',
        taxId: '0123456789',
      },
    };
  }

  getSubtotal(): number {
    let subtotal = 0;
    this.cart$
      .subscribe((cart) => {
        subtotal = cart?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
      })
      .unsubscribe();
    return subtotal;
  }

  getDiscount(): number {
    // Logic tính giảm giá dựa trên membership level
    const subtotal = this.getSubtotal();
    if (!this.selectedCustomer) return 0;

    const discountRates = {
      Bronze: 0,
      Silver: 0.05,
      Gold: 0.1,
      Platinum: 0.15,
    };

    return (
      subtotal *
      (discountRates[
        this.selectedCustomer.membershipLevel as keyof typeof discountRates
      ] || 0)
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const loyaltyDiscount = this.loyaltyPointsUsed * 1000; // 1 điểm = 1000 VND
    return Math.max(0, subtotal - discount - loyaltyDiscount);
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Hết hàng';
    if (stock <= 10) return 'Sắp hết';
    return 'Còn hàng';
  }

  getStockSeverity(stock: number): 'success' | 'warning' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

  getPaymentMethodLabel(method: string): string {
    const labels = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      digital: 'Ví điện tử',
    };
    return labels[method as keyof typeof labels] || method;
  }
  onImageError(event: any) {
    event.target.src = '/assets/placeholder.svg';
  }

  // TrackBy functions for performance
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  trackByCartItem(index: number, item: CartItem): string {
    return item.productId;
  }

  // Helper method for stock styling
  getStockClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';

    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  }

  onDialogHide() {
    // Handle proper closing of the customer dialog
    if (this.showCustomerDialog) {
      this.showCustomerDialog = false;
    }
    // Reset the new customer object
    this.newCustomer = { name: '', phone: '', email: '', address: '' };
  }

  onPaymentDialogHide() {
    // Handle proper closing of the payment dialog
    if (this.showPaymentDialog) {
      this.showPaymentDialog = false;
    }
  }
}
