import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import {
  Order,
  OrderItem,
  Payment,
  CreateOrderRequest,
  CreateOrderItemRequest,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [
    {
      OrderID: 1,
      CustomerID: 1,
      StaffID: 1,
      OrderDate: new Date('2024-06-01'),
      TotalAmount: 598000,
      VoucherID: undefined,
      DiscountAmount: 0,
      Status: 'Completed',
      IsActive: true,
      CreatedAt: new Date('2024-06-01'),
      UpdatedAt: new Date('2024-06-01'),
    },
    {
      OrderID: 2,
      CustomerID: 2,
      StaffID: 1,
      OrderDate: new Date('2024-06-02'),
      TotalAmount: 450000,
      VoucherID: 1,
      DiscountAmount: 45000,
      Status: 'Processing',
      IsActive: true,
      CreatedAt: new Date('2024-06-02'),
      UpdatedAt: new Date('2024-06-02'),
    },
    {
      OrderID: 3,
      CustomerID: 3,
      StaffID: 2,
      OrderDate: new Date('2024-06-03'),
      TotalAmount: 299000,
      VoucherID: undefined,
      DiscountAmount: 0,
      Status: 'Pending',
      IsActive: true,
      CreatedAt: new Date('2024-06-03'),
      UpdatedAt: new Date('2024-06-03'),
    },
  ];

  private orderItems: OrderItem[] = [
    {
      OrderItemID: 1,
      OrderID: 1,
      VariantID: 1,
      Quantity: 2,
      Price: 299000,
      IsActive: true,
      CreatedAt: new Date('2024-06-01'),
    },
    {
      OrderItemID: 2,
      OrderID: 2,
      VariantID: 2,
      Quantity: 1,
      Price: 450000,
      IsActive: true,
      CreatedAt: new Date('2024-06-02'),
    },
    {
      OrderItemID: 3,
      OrderID: 3,
      VariantID: 3,
      Quantity: 1,
      Price: 299000,
      IsActive: true,
      CreatedAt: new Date('2024-06-03'),
    },
  ];

  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);
  public orders$ = this.ordersSubject.asObservable();

  getOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(300));
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const order = this.orders.find((o) => o.OrderID === id);
    return of(order).pipe(delay(200));
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    const items = this.orderItems.filter((item) => item.OrderID === orderId);
    return of(items).pipe(delay(200));
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    // Calculate total amount from order items
    const totalAmount = request.OrderItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );

    const newOrder: Order = {
      OrderID: this.orders.length + 1,
      CustomerID: request.CustomerID,
      StaffID: request.StaffID,
      OrderDate: new Date(),
      TotalAmount: totalAmount,
      VoucherID: request.VoucherID,
      DiscountAmount: 0,
      Status: 'Pending',
      IsActive: true,
      CreatedAt: new Date(),
      OrderItems: request.OrderItems.map((item, index) => ({
        OrderItemID: this.orderItems.length + index + 1,
        OrderID: this.orders.length + 1,
        VariantID: item.VariantID,
        Quantity: item.Quantity,
        Price: item.Price,
        IsActive: true,
        CreatedAt: new Date(),
      })),
    };

    this.orders.push(newOrder);
    this.ordersSubject.next([...this.orders]);
    return of(newOrder).pipe(delay(500));
  }

  updateOrder(id: number, updates: Partial<Order>): Observable<Order> {
    const index = this.orders.findIndex((o) => o.OrderID === id);
    if (index !== -1) {
      this.orders[index] = {
        ...this.orders[index],
        ...updates,
        UpdatedAt: new Date(),
      };
      this.ordersSubject.next([...this.orders]);
    }
    return of(this.orders[index]).pipe(delay(400));
  }

  deleteOrder(id: number): Observable<boolean> {
    const index = this.orders.findIndex((o) => o.OrderID === id);
    if (index !== -1) {
      this.orders[index].IsActive = false;
      this.ordersSubject.next([...this.orders]);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  // Helper method for status updates
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.updateOrder(id, { Status: status });
  }

  // Get order statistics
  getOrderStats(): Observable<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }> {
    const activeOrders = this.orders.filter((o) => o.IsActive);
    const stats = {
      totalOrders: activeOrders.length,
      pendingOrders: activeOrders.filter((o) => o.Status === 'Pending').length,
      completedOrders: activeOrders.filter((o) => o.Status === 'Completed')
        .length,
      totalRevenue: activeOrders.reduce((sum, o) => sum + o.TotalAmount, 0),
    };
    return of(stats).pipe(delay(200));
  }
}
