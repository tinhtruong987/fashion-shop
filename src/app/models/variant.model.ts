export interface Size {
  sizeID: number;
  sizeName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  colorID: number;
  colorName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Voucher {
  voucherID: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  expiryDate: Date;
  usageLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum DiscountType {
  Percentage = 'Percentage',
  FixedAmount = 'FixedAmount',
}
