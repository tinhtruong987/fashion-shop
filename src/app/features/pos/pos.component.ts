import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule, InputNumberInputEvent } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Product, ProductVariant } from '../../models/product.model';
import { Customer } from '../../models/user.model';
import { Order, PaymentMethod } from '../../models/order.model';
import { Voucher } from '../../models/variant.model';
import { ProductService } from '../../core/services/product.service';
import { POSService, CartItem } from '../../core/services/pos.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    DialogModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class POSComponent implements OnInit {
  products: Product[] = [];
  cartItems: CartItem[] = [];
  selectedProduct: Product | null = null;
  selectedVariant: ProductVariant | null = null;
  quantity = 1;
  customer: Customer | null = null;
  voucher: Voucher | null = null;
  paymentMethod: PaymentMethod = PaymentMethod.Cash;
  displayCustomerDialog = false;
  displayPaymentDialog = false;
  loading = false;

  customerForm: FormGroup;
  paymentForm: FormGroup;

  constructor(
    private productService: ProductService,
    private posService: POSService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: ['', Validators.email],
      address: [''],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: [PaymentMethod.Cash, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.posService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.posService.setProducts(products);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách sản phẩm',
        });
        this.loading = false;
      },
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    if (product.variants && product.variants.length > 0) {
      this.selectedVariant = product.variants[0];
    }
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  addToCart(): void {
    if (this.selectedVariant) {
      this.posService.addToCart(this.selectedVariant, this.quantity);
      this.quantity = 1;
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thêm vào giỏ hàng',
      });
    }
  }

  removeFromCart(variantId: number): void {
    this.posService.removeFromCart(variantId);
  }

  updateQuantity(variantId: number, event: InputNumberInputEvent): void {
    const item = this.cartItems.find(
      (item) => item.variant.variantID === variantId
    );
    if (item && typeof event.value === 'number') {
      item.quantity = event.value;
    }
  }

  clearCart(): void {
    this.posService.clearCart();
  }

  getTotalAmount(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getDiscountAmount(): number {
    if (!this.voucher) return 0;
    return this.posService.calculateDiscount(
      this.getTotalAmount(),
      this.voucher
    );
  }

  getFinalAmount(): number {
    return this.getTotalAmount() - this.getDiscountAmount();
  }

  openCustomerDialog(): void {
    this.displayCustomerDialog = true;
  }

  saveCustomer(): void {
    if (this.customerForm.valid) {
      this.customer = {
        customerID: 0,
        name: this.customerForm.value.name,
        phone: this.customerForm.value.phone,
        email: this.customerForm.value.email,
        address: this.customerForm.value.address,
        loyaltyPoints: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.displayCustomerDialog = false;
    }
  }

  openPaymentDialog(): void {
    this.paymentForm.patchValue({
      amount: this.getFinalAmount(),
    });
    this.displayPaymentDialog = true;
  }

  processPayment(): void {
    if (this.paymentForm.valid) {
      const { paymentMethod, amount } = this.paymentForm.value;
      this.posService
        .createOrder(this.customer, 1, this.voucher || undefined)
        .subscribe({
          next: (order) => {
            this.posService
              .processPayment(order.orderID, paymentMethod, amount)
              .subscribe({
                next: (payment) => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thanh toán thành công',
                  });
                  this.clearCart();
                  this.customer = null;
                  this.voucher = null;
                  this.displayPaymentDialog = false;
                },
                error: (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể xử lý thanh toán',
                  });
                },
              });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tạo đơn hàng',
            });
          },
        });
    }
  }

  getProductName(item: CartItem): string {
    return (
      this.products.find((p) => p.productID === item.variant.productID)?.name ||
      'Unknown Product'
    );
  }
}
