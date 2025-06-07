export interface Voucher {
  voucherID: number;
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  minOrderValue: number;
  expiryDate: Date;
  usageLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
