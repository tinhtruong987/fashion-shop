import { Customer } from './customer.model';
import { Staff } from './staff.model';
import { Voucher } from './voucher.model';
import { ProductVariant } from './product.model';

export interface Order {
  OrderID: number;
  CustomerID?: number;
  StaffID: number;
  OrderDate: Date;
  TotalAmount: number;
  VoucherID?: number;
  DiscountAmount: number;
  Status: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  Customer?: Customer;
  Staff?: Staff;
  Voucher?: Voucher;
  OrderItems?: OrderItem[];
}

export interface OrderItem {
  OrderItemID: number;
  OrderID: number;
  VariantID: number;
  Quantity: number;
  Price: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  ProductVariant?: ProductVariant;
}

export interface CreateOrderRequest {
  CustomerID?: number;
  StaffID: number;
  VoucherID?: number;
  OrderItems: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  VariantID: number;
  Quantity: number;
  Price: number;
}

export interface Payment {
  PaymentID: number;
  OrderID: number;
  PaymentMethod: string;
  Amount: number;
  PaymentDate: Date;
  Status: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreatePaymentRequest {
  OrderID: number;
  PaymentMethod: string;
  Amount: number;
}
