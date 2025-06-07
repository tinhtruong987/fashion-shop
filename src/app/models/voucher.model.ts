export interface Voucher {
  voucherID: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoucherWithUsage extends Voucher {
  usageHistory: {
    orderID: number;
    orderDate: Date;
    customerName: string;
    discountAmount: number;
  }[];
}
