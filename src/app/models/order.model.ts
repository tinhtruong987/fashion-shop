import { ProductVariant, Product } from './product.model';
import { Customer } from './customer.model';
import { Staff } from './staff.model';

export enum PaymentMethod {
  Cash = 'CASH',
  Card = 'CARD',
  Momo = 'MOMO',
  VNPay = 'VNPAY',
}

export interface Order {
  orderID: number;
  customerID: number;
  staffID: number;
  orderDate: Date;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  staff?: Staff;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  orderItemID: number;
  orderID: number;
  productID: number;
  variantID: number;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  variant?: ProductVariant;
}

export interface OrderWithDetails extends Order {
  customer: {
    customerID: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    loyaltyPoints: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  staff: {
    staffID: number;
    userAccountID: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  orderItems: Array<{
    orderItemID: number;
    orderID: number;
    productID: number;
    variantID: number;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    product: {
      productID: number;
      productCode: string;
      name: string;
      categoryID: number;
      description: string;
      price: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    variant: {
      variantID: number;
      productID: number;
      sizeID: number;
      colorID: number;
      stock: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}

export interface Payment {
  paymentID: number;
  orderID: number;
  paymentMethod: PaymentMethod;
  amount: number;
  paymentDate: Date;
  status: PaymentStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded',
}
