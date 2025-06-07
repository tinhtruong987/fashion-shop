export interface Customer {
  customerID: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerWithOrders extends Customer {
  orders: {
    orderID: number;
    orderDate: Date;
    totalAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  }[];
}
