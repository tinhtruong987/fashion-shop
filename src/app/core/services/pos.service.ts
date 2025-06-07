import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product, ProductVariant } from '../../models/product.model';
import {
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../models/order.model';
import { Customer } from '../../models/user.model';
import { Voucher } from '../../models/variant.model';

export interface CartItem {
  variant: ProductVariant;
  quantity: number;
  price: number;
  productName: string;
}

@Injectable({
  providedIn: 'root',
})
export class POSService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private currentOrder = new BehaviorSubject<Order | null>(null);
  private mockOrders: Order[] = [];
  private products: Product[] = [];

  constructor() {}

  setProducts(products: Product[]): void {
    this.products = products;
  }

  // Cart Management
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(variant: ProductVariant, quantity: number): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(
      (item) => item.variant.variantID === variant.variantID
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.next([...currentItems]);
    } else {
      const product = this.products.find(
        (p) => p.productID === variant.productID
      );
      this.cartItems.next([
        ...currentItems,
        {
          variant,
          quantity,
          price: variant.stock,
          productName: product?.name || 'Unknown Product',
        },
      ]);
    }
  }

  removeFromCart(variantId: number): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next(
      currentItems.filter((item) => item.variant.variantID !== variantId)
    );
  }

  updateCartItemQuantity(variantId: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(
      (item) => item.variant.variantID === variantId
    );
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  // Order Management
  createOrder(
    customer: Customer | null,
    staffId: number,
    voucher?: Voucher
  ): Observable<Order> {
    const cartItems = this.cartItems.value;
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = voucher
      ? this.calculateDiscount(totalAmount, voucher)
      : 0;

    const newOrder: Order = {
      orderID: this.mockOrders.length + 1,
      customerID: customer?.customerID ?? 0,
      staffID: staffId,
      orderDate: new Date(),
      totalAmount,
      discountAmount,
      finalAmount: totalAmount - discountAmount,
      paymentMethod: PaymentMethod.Cash,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      orderItems: cartItems.map((item) => ({
        orderItemID: 0, // Will be set by backend
        orderID: 0, // Will be set by backend
        productID: item.variant.productID,
        variantID: item.variant.variantID,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        total: item.price * item.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    this.mockOrders.push(newOrder);
    this.currentOrder.next(newOrder);
    this.clearCart();
    return of(newOrder);
  }

  processPayment(
    orderId: number,
    paymentMethod: PaymentMethod,
    amount: number
  ): Observable<Payment> {
    const order = this.mockOrders.find((o) => o.orderID === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const payment: Payment = {
      paymentID: this.mockOrders.length + 1,
      orderID: orderId,
      paymentMethod,
      amount,
      paymentDate: new Date(),
      status: PaymentStatus.Completed,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    order.status = 'COMPLETED';
    return of(payment);
  }

  public calculateDiscount(totalAmount: number, voucher: Voucher): number {
    if (totalAmount < voucher.minOrderValue) {
      return 0;
    }

    if (voucher.discountType === 'Percentage') {
      return (totalAmount * voucher.discountValue) / 100;
    } else {
      return voucher.discountValue;
    }
  }

  // Customer Loyalty
  calculateLoyaltyPoints(amount: number): number {
    // Example: 1 point per 100,000 VND
    return Math.floor(amount / 100000);
  }

  applyLoyaltyDiscount(points: number): number {
    // Example: 1 point = 1,000 VND discount
    return points * 1000;
  }
}
