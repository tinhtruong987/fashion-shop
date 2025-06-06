import { Customer } from '../../customer/model/customer.model';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital';
  amount: number;
}

export interface Receipt {
  receiptNumber: string;
  saleId: string;
  customerInfo?: {
    name: string;
    membershipLevel: string;
    loyaltyPoints: number;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  total: number;
  paymentMethods: PaymentMethod[];
  cashierName: string;
  saleDate: Date;
  storeInfo: {
    name: string;
    address: string;
    phone: string;
    taxId: string;
  };
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  total: number;
  paymentMethods: PaymentMethod[];
  cashierId: string;
  cashierName: string;
  saleDate: Date;
  status: 'completed' | 'refunded' | 'partial-refund';
  receipt?: Receipt;
}

export interface POSState {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  currentSale: Sale | null;
  loyaltyPointsToUse: number;
  discountPercentage: number;
  isProcessingPayment: boolean;
  lastReceipt: Receipt | null;
}
