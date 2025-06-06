export interface Voucher {
  VoucherID: number;
  Code: string;
  DiscountType: 'Percentage' | 'FixedAmount';
  DiscountValue: number;
  MinOrderValue: number;
  ExpiryDate?: Date;
  UsageLimit: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateVoucherRequest {
  Code: string;
  DiscountType: 'Percentage' | 'FixedAmount';
  DiscountValue: number;
  MinOrderValue: number;
  ExpiryDate?: Date;
  UsageLimit: number;
}

export interface UpdateVoucherRequest {
  VoucherID: number;
  Code: string;
  DiscountType: 'Percentage' | 'FixedAmount';
  DiscountValue: number;
  MinOrderValue: number;
  ExpiryDate?: Date;
  UsageLimit: number;
  IsActive: boolean;
}
