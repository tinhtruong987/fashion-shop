import { Customer } from './customer.model';
import { Staff } from './staff.model';
import { Voucher } from './voucher.model';
import { ProductVariant } from './product.model';

export interface Order {
  orderID: number;
  customerID: number;
  staffID: number;
  orderDate: Date;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CARD' | 'MOMO';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date | null;
}

export interface OrderItem {
  orderItemID: number;
  orderID: number;
  variantID: number;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Payment {
  paymentID: number;
  orderID: number;
  paymentMethod: string;
  amount: number;
  paymentDate: Date;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
